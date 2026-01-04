App({
  globalData: {
    version: 'Lingtu-1.0'
  },

  onLaunch() {
    this.ensureLocalProfile();
  },

  ensureLocalProfile() {
    if (typeof wx.getStorageSync('cultivatorProfile') === 'undefined') {
      wx.setStorageSync('cultivatorProfile', null);
    }
  },

  saveCultivatorProfile(profile) {
    wx.setStorageSync('cultivatorProfile', profile);
  },

  getCultivatorProfile() {
    return wx.getStorageSync('cultivatorProfile') || null;
  },

  clearCultivatorProfile() {
    wx.removeStorageSync('cultivatorProfile');
  }
});