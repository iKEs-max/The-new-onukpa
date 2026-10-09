import{l as t,o as e}from"./index-DeVM_ric.js";/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=t("Filter",[["polygon",{points:"22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3",key:"1yg77f"}]]);/**
 * @license lucide-react v0.363.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const _=t("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]]),u="_bar_onhil_1",d="_left_onhil_19",x="_right_onhil_33",f="_searchWrapper_onhil_45",m="_searchIcon_onhil_57",j="_searchInput_onhil_71",v="_filterWrapper_onhil_103",I="_filterIcon_onhil_113",g="_select_onhil_127",r={bar:u,left:d,right:x,searchWrapper:f,searchIcon:m,searchInput:j,filterWrapper:v,filterIcon:I,select:g},N=({searchValue:n,onSearchChange:i,searchPlaceholder:o="Search...",statusOptions:l,selectedStatus:h,onStatusChange:c,actions:a})=>e.jsxs("div",{className:r.bar,children:[e.jsxs("div",{className:r.left,children:[e.jsxs("div",{className:r.searchWrapper,children:[e.jsx(_,{size:16,className:r.searchIcon}),e.jsx("input",{type:"text",className:r.searchInput,value:n,onChange:s=>i(s.target.value),placeholder:o})]}),l&&c&&e.jsxs("div",{className:r.filterWrapper,children:[e.jsx(p,{size:14,className:r.filterIcon}),e.jsxs("select",{className:r.select,value:h||"",onChange:s=>c(s.target.value),title:"Filter by status",children:[e.jsx("option",{value:"",children:"All Status"}),l.map(s=>e.jsx("option",{value:s.value,children:s.label},s.value))]})]})]}),a&&e.jsx("div",{className:r.right,children:a})]});export{N as F};
