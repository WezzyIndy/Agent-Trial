// Actual 2026 FIFA World Cup Round-of-32 matchups, confirmed after the group
// stage (June 2026). Slot order below is arranged so the app's binary tree
// (R32-1 & R32-2 -> R16-1, etc.) reproduces FIFA's official bracket — i.e. the
// two teams the app advances into each later-round match are the same two the
// real bracket sends there.
//
// Mapping to FIFA's (schedule-ordered) match numbers and how they feed forward:
//   R16 M89 = W74 vs W77   R16 M90 = W73 vs W75   R16 M91 = W76 vs W78
//   R16 M92 = W79 vs W80   R16 M93 = W83 vs W84   R16 M94 = W81 vs W82
//   R16 M95 = W86 vs W88   R16 M96 = W85 vs W87
//   QF M97 = W89/W90   QF M98 = W93/W94   QF M99 = W91/W92   QF M100 = W95/W96
//   SF M101 = W97/W98   SF M102 = W99/W100   Final M104 = W101/W102
//
// To correct any matchup later, edit it here or use the Admin screen.
export const DEFAULT_R32 = {
  // Top half — feeds Semifinal 1 (M101)
  'R32-1': { a: 'Germany', b: 'Paraguay' }, //         FIFA M74
  'R32-2': { a: 'France', b: 'Sweden' }, //            FIFA M77  -> R16 M89
  'R32-3': { a: 'South Africa', b: 'Canada' }, //      FIFA M73
  'R32-4': { a: 'Netherlands', b: 'Morocco' }, //      FIFA M75  -> R16 M90  (QF M97)
  'R32-5': { a: 'Portugal', b: 'Croatia' }, //         FIFA M83
  'R32-6': { a: 'Spain', b: 'Austria' }, //            FIFA M84  -> R16 M93
  'R32-7': { a: 'USA', b: 'Bosnia and Herzegovina' }, //FIFA M81
  'R32-8': { a: 'Belgium', b: 'Senegal' }, //          FIFA M82  -> R16 M94  (QF M98)
  // Bottom half — feeds Semifinal 2 (M102)
  'R32-9': { a: 'Brazil', b: 'Japan' }, //             FIFA M76
  'R32-10': { a: 'Ivory Coast', b: 'Norway' }, //      FIFA M78  -> R16 M91
  'R32-11': { a: 'Mexico', b: 'Ecuador' }, //          FIFA M79
  'R32-12': { a: 'England', b: 'DR Congo' }, //        FIFA M80  -> R16 M92  (QF M99)
  'R32-13': { a: 'Argentina', b: 'Cape Verde' }, //    FIFA M86
  'R32-14': { a: 'Australia', b: 'Egypt' }, //         FIFA M88  -> R16 M95
  'R32-15': { a: 'Switzerland', b: 'Algeria' }, //     FIFA M85
  'R32-16': { a: 'Colombia', b: 'Ghana' }, //          FIFA M87  -> R16 M96  (QF M100)
}
