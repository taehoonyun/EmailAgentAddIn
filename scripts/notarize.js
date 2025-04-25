// This is a dummy afterSign hook that does nothing
// It's used to prevent electron-builder from trying to notarize the app
// which requires valid Apple credentials
module.exports = async function(params) {
  // Do nothing, just return
  console.log('Skipping notarization step');
  return;
}; 