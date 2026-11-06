/**
 * Location and Indian Pincode Utilities
 */

const PINCODE_CITY_MAP = [
  { prefix: '11', city: 'New Delhi' },
  { prefix: '12', city: 'Gurugram' },
  { prefix: '13', city: 'Haryana' },
  { prefix: '14', city: 'Chandigarh' },
  { prefix: '16', city: 'Chandigarh' },
  { prefix: '20', city: 'Noida' },
  { prefix: '22', city: 'Lucknow' },
  { prefix: '30', city: 'Jaipur' },
  { prefix: '38', city: 'Ahmedabad' },
  { prefix: '40', city: 'Mumbai' },
  { prefix: '41', city: 'Pune' },
  { prefix: '45', city: 'Indore' },
  { prefix: '50', city: 'Hyderabad' },
  { prefix: '56', city: 'Bengaluru' },
  { prefix: '60', city: 'Chennai' },
  { prefix: '68', city: 'Kochi' },
  { prefix: '70', city: 'Kolkata' },
  { prefix: '80', city: 'Patna' }
];

export const inferCityFromPincode = (pincode) => {
  const pin = String(pincode || '').trim();
  const match = PINCODE_CITY_MAP.find((m) => pin.startsWith(m.prefix));
  return match ? match.city : 'India';
};

export const getGuestLocation = () => {
  try {
    const saved = localStorage.getItem('machobeast_guest_location');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.pincode) {
        return {
          pincode: parsed.pincode,
          city: parsed.city || inferCityFromPincode(parsed.pincode)
        };
      }
    }
  } catch (e) {}
  return { pincode: '400001', city: 'Mumbai' };
};

export const saveGuestLocation = (pincode, city) => {
  try {
    const data = {
      pincode: String(pincode).trim(),
      city: city || inferCityFromPincode(pincode)
    };
    localStorage.setItem('machobeast_guest_location', JSON.stringify(data));
    return data;
  } catch (e) {
    return { pincode, city };
  }
};

