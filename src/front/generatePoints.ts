const GRID_SIZE = 50; 
export  const generatePoints = (callback) => {
  let lng = 55.993004814153956;
  let lat = 36.84402465820313;
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      callback(lat, lng);
      lat = lat + 0.0001;
    }
    lng = lng + 0.0001;
  }
};