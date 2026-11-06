/**
 * useCartSync — a thin wrapper around cart dispatch actions that
 * automatically syncs the cart to the backend after every mutation.
 *
 * Usage (replaces direct dispatch of addToCart / removeFromCart / updateQuantity):
 *
 *   const { addItem, removeItem, changeQty } = useCartSync();
 *   addItem({ id, name, price, variant, ... });
 */
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  syncCartWithServer
} from '../redux/slices/cartSlice';

export const useCartSync = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  /**
   * Dispatch a cart mutation action, then immediately push the resulting
   * cart state to the backend if the user is authenticated.
   *
   * We read items AFTER the dispatch so we always get the latest snapshot.
   */
  const mutateAndSync = async (action) => {
    // 1. Apply the local mutation synchronously
    dispatch(action);

    // 2. If logged in, grab the updated items from the store via getState
    //    We use a tiny Promise.resolve() tick so Redux has committed the update
    if (isAuthenticated) {
      // Use a micro-task to let the Redux state settle before reading
      await Promise.resolve();
      // We can't read updated state directly here (stale closure), so we
      // dispatch syncCartWithServer with a callback pattern via thunk
      dispatch(syncAfterMutation());
    }
  };

  /**
   * Thunk that reads the latest cart state and syncs it.
   * This avoids the stale closure problem: the thunk's getState()
   * always returns the current Redux state at call time.
   */
  const syncAfterMutation = () => async (thunkDispatch, getState) => {
    const latestItems = getState().cart.items;
    // Serialize to plain JS objects (strip any Immer proxies)
    const plainItems = JSON.parse(JSON.stringify(latestItems));
    thunkDispatch(syncCartWithServer(plainItems));
  };

  return {
    /** Add a new item or increment qty of an existing item, then sync to DB */
    addItem: (payload) => mutateAndSync(addToCart(payload)),

    /** Remove an item by id+variant, then sync to DB */
    removeItem: (payload) => mutateAndSync(removeFromCart(payload)),

    /** Set a specific quantity for an item, then sync to DB */
    changeQty: (payload) => mutateAndSync(updateQuantity(payload)),

    /** Clear entire cart AND delete from DB (use after order placement only) */
    clearAll: () => dispatch(clearCart())
  };
};

