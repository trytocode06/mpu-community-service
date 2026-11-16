"use strict";
/* Game data: bins and items. Add or edit items here. */
/* ---- data: 4 bins, 10 items ---- */
var BINS={
 blue:{label:"Paper",icon:"📄",col:"#2f7df6",dark:"#1f5fc7"},
 orange:{label:"Plastic / Aluminium",icon:"🥤",col:"#ff8a1f",dark:"#d46a08"},
 brown:{label:"Glass",icon:"🍾",col:"#8a5a2b",dark:"#654019"},
 black:{label:"Non-recyclable",icon:"🚫",col:"#2d2d35",dark:"#15151b"}
};
var WATER='<svg viewBox="0 0 40 64"><rect x="15" y="2" width="10" height="7" rx="2" fill="#2f7df6" stroke="#1b1f3b" stroke-width="2.5"/><path d="M14 9h12v6c6 4 8 8 8 14v28c0 3-2 5-5 5H11c-3 0-5-2-5-5V29c0-6 2-10 8-14z" fill="#bfe8ff" stroke="#1b1f3b" stroke-width="3" stroke-linejoin="round"/><rect x="7.5" y="32" width="25" height="14" fill="#2f7df6" opacity=".55"/></svg>';
var ITEMS=[
 {n:"Newspaper",e:"📰",b:"blue",h:"Newspapers are paper – blue bin!"},
 {n:"Cardboard box",e:"📦",b:"blue",h:"Cardboard is paper – blue bin!"},
 {n:"Water bottle",e:WATER,b:"orange",h:"Plastic bottles go in the orange bin!"},
 {n:"Drink can",e:"🥫",b:"orange",h:"Cans go in the orange bin!"},
 {n:"Shampoo bottle",e:"🧴",b:"orange",h:"Plastic bottles go in the orange bin!"},
 {n:"Glass jar",e:"🫙",b:"brown",h:"Glass jars go in the brown bin!"},
 {n:"Wine bottle",e:"🍷",b:"brown",h:"Glass bottles go in the brown bin!"},
 {n:"Drinking glass",e:"🥛",b:"brown",h:"Glass goes in the brown bin!"},
 {n:"Styrofoam box",e:"🥡",b:"black",h:"Styrofoam can’t be recycled – black bin!"},
 {n:"Battery",e:"🔋",b:"black",h:"Batteries aren’t kerbside recyclable – black bin!"}
];

var DIFF={"Drinking glass":2}; // clarity of existing items: 1 clear-cut, 2 medium, 3 tricky (default 1)
// Extra items for the Sort It Right pool only (Quiz It Right keeps its own 10); same format plus d
var EXTRA=[
 {n:"Magazine",e:"📖",b:"blue",d:1,h:"Magazines are paper – blue bin!"},
 {n:"Envelope",e:"✉️",b:"blue",d:1,h:"Envelopes are paper – blue bin!"},
 {n:"Book",e:"📚",b:"blue",d:2,h:"Books are paper – blue bin!"},
 {n:"Egg carton",e:"🥚",b:"blue",d:2,h:"Cardboard egg cartons are paper – blue bin!"},
 {n:"Cardboard tube",e:"📜",b:"blue",d:3,h:"Cardboard tubes are paper – blue bin!"},
 {n:"Yoghurt tub",e:"🥣",b:"orange",d:2,h:"Plastic tubs go in the orange bin!"},
 {n:"Plastic bag",e:"🛍️",b:"orange",d:2,h:"Clean plastic bags go in the orange bin!"},
 {n:"Aluminium foil",e:"🌯",b:"orange",d:3,h:"Foil is aluminium – orange bin!"},
 {n:"Metal bottle cap",e:"🔘",b:"orange",d:3,h:"Metal caps go in the orange bin!"},
 {n:"Jam jar",e:"🍯",b:"brown",d:1,h:"Glass jars go in the brown bin!"},
 {n:"Glass medicine bottle",e:"💊",b:"brown",d:3,h:"Glass bottles go in the brown bin!"},
 {n:"Cigarette butt",e:"🚬",b:"black",d:1,h:"Cigarette butts can’t be recycled – black bin!"},
 {n:"Used tissue",e:"🤧",b:"black",d:2,h:"Used tissues are too soiled to recycle – black bin!"},
 {n:"Crisp packet",e:"🍟",b:"black",d:2,h:"Foil-lined packets can’t be recycled – black bin!"},
 {n:"Greasy pizza box",e:"🍕",b:"black",d:3,h:"Greasy cardboard can’t be recycled – black bin!"},
 {n:"Ceramic plate",e:"🍽️",b:"black",d:3,h:"Ceramics can’t be recycled with glass – black bin!"},
 {n:"Light bulb",e:"💡",b:"black",d:3,h:"Light bulbs aren’t recyclable glass – black bin!"},
 {n:"Shiny wrapping paper",e:"🎁",b:"black",d:3,h:"Coated wrapping paper can’t be recycled – black bin!"}
];
var POOL=ITEMS.map(function(x){return{n:x.n,e:x.e,b:x.b,h:x.h,d:DIFF[x.n]||1}}).concat(EXTRA);
