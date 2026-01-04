const QUOTES = [
  '朝闻道，夕死可矣。',
  '天地不仁，以万物为刍狗。',
  '修行之道，贵在坚持与抉择。',
  '一念成魔，一念成仙。',
  '拂袖可摘星河，抬眸便见山海。'
];

const FEATURES = [
  {
    title: '境界飞升',
    desc: '从炼气启程，直至飞升仙界，每一层都有独特突破机制。'
  },
  {
    title: '寿元争夺',
    desc: '修为虽高，寿元有限，需要在闭关与历练间权衡。'
  },
  {
    title: '奇遇不断',
    desc: '山海秘境、灵田悟道、妖兽伏袭……每次出行都可能逆天改命。'
  }
];

Page({
  data: {
    heroTitle: '灵途纪',
    description: '一款纯文字的修仙体验，从微弱灵火到飞升仙界，记录你在灵州大陆的每一步抉择。',
    glimpse: '',
    features: FEATURES,
    profilePreview: null
  },

  onShow() {
    this.setData({
      glimpse: this.pickRandom(QUOTES)
    });
    this.loadProfilePreview();
  },

  pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)];
  },

  loadProfilePreview() {
    const saved = wx.getStorageSync('cultivatorProfile');
    if (saved && saved.name) {
      const stats = saved.stats || {};
      const attributes = saved.attributes || {};
      this.setData({
        profilePreview: {
          name: saved.name,
          realm: saved.currentRealm || '炼气',
          rank: saved.sectRank || '外门记名弟子',
          age: saved.age || 16,
          lifespan: Math.max(0, Math.round((saved.lifespanCeiling || 0) - (saved.age || 0))),
          luck: attributes.luck ?? '--',
          attack: stats.attack ?? '--',
          defense: stats.defense ?? '--',
          hp: stats.maxHp ? `${stats.currentHp || stats.maxHp}/${stats.maxHp}` : '--',
          mana: stats.maxMana ? `${stats.currentMana || stats.maxMana}/${stats.maxMana}` : '--'
        }
      });
    } else {
      this.setData({ profilePreview: null });
    }
  },

  navigateToChatBot() {
    wx.navigateTo({
      url: '/pages/chatBot/chatBot'
    });
  }
});