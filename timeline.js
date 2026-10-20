(() => {
  'use strict';
  // Restore the reference opening and its recorded music change at 9.7 s.
  // Later scenes retain their existing pace and interactive fuel stop.
  const LATE_SHIFT = 7.3;
  const OPENING_DURATION = 37.407007 + LATE_SHIFT;
  const DURATION = 94.540998 + LATE_SHIFT;
  const SCENES = Object.freeze([
    {at: 0, id: 'intro', text: 'này bà ơi'},
    {at: 1.5, id: 'wake', text: 'tui là KiKi ><'},
    {at: 4.9, id: 'mission', text: 'tui được giao một nhiệm vụ rất đặc biệt!'},
    {at: 9.7, id: 'gift', text: 'ủa... hôm nay bà rạng rỡ ghê'},
    {at: 15.15, id: 'meadow', text: 'đúng rồi hôm nay là\n20/10'},
    {at: 20.5, id: 'wish', text: 'nên là tui muốn'},
    {at: 24, id: 'health', text: 'chúc bà thật nhiều sức khoẻ'},
    {at: 28.2, id: 'beauty', text: 'chúc bà thật xinh đẹp'},
    {at: 31.4, id: 'smile', text: 'và chúc bà luôn giữ\nnụ cười trên môi'},
    {at: OPENING_DURATION, id: 'clover', text: 'tui tặng bà nhành cỏ 4 lá này'},
    {at: 40.6 + LATE_SHIFT, id: 'give', text: 'nhận lấy may mắn nè!'},
    {at: 43.9 + LATE_SHIFT, id: 'luck', text: 'mong may mắn luôn mỉm cười với bà'},
    {at: 48.7 + LATE_SHIFT, id: 'ready', text: 'bà sẵn sàng chưa?'},
    {at: 52.7 + LATE_SHIFT, id: 'flight', text: 'Cùng tui gửi một điều ước thật đẹp cho ngày hôm nay nhé'},
    {at: 55.9 + LATE_SHIFT, id: 'moon', text: 'và khám phá bất ngờ cuối cùng với tui nhé?'},
    {at: 63.7 + LATE_SHIFT, id: 'letter', text: 'một lời chúc thật đặc biệt'}
  ].map(Object.freeze));
  const VERSES = Object.freeze([Object.freeze({at: 0, text: ''})]);
  function itemAt(list, seconds) {
    let result = list[0];
    for (const item of list) {
      if (seconds < item.at) break;
      result = item;
    }
    return result;
  }
  const timeline = Object.freeze({duration: DURATION, openingDuration: OPENING_DURATION, musicChangeAt: 9.7, fuelAt: 54.1 + LATE_SHIFT, fuelDuration: 1.8, scenes: SCENES, verses: VERSES,
    sceneAt: seconds => itemAt(SCENES, seconds), verseAt: seconds => itemAt(VERSES, seconds)});
  if (typeof module === 'object' && module.exports) module.exports = timeline;
  globalThis.GiftTimeline = timeline;
})();
