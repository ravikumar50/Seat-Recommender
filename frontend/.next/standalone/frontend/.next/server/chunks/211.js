"use strict";exports.id=211,exports.ids=[211],exports.modules={4211:(a,b,c)=>{c.r(b),c.d(b,{default:()=>k});var d=c(8732),e=c(9501),f=c.n(e),g=c(2015),h=c(5165),i=c.n(h);let j=({path:a,sunPositions:b})=>((0,g.useEffect)(()=>{let c=i().map("map").setView([a[0].lat,a[0].lon],5);i().tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(c);let d=a.map(a=>[a.lat,a.lon]);i().polyline(d,{color:"blue"}).addTo(c),b.forEach(a=>{i().circleMarker([a.lat,a.lon],{radius:3,color:a.altitude>0?"yellow":"gray"}).addTo(c)});let e=i().control({position:"bottomright"});return e.onAdd=function(){let a=i().DomUtil.create("div","map-legend");return a.innerHTML=`
        <div style="background: white; padding: 12px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); font-size: 12px; min-width: 150px;">
          <h4 style="margin: 0 0 8px 0; color: #2c3e50;">Flight Map Legend</h4>
          <div style="display: flex; align-items: center; margin: 4px 0;">
            <div style="width: 20px; height: 4px; background: blue; margin-right: 8px;"></div>
            <span>Flight Path</span>
          </div>
          <div style="display: flex; align-items: center; margin: 4px 0;">
            <div style="width: 12px; height: 12px; background: yellow; border-radius: 50%; margin-right: 8px; border: 1px solid #ccc;"></div>
            <span>Daytime Sun</span>
          </div>
          <div style="display: flex; align-items: center; margin: 4px 0;">
            <div style="width: 12px; height: 12px; background: gray; border-radius: 50%; margin-right: 8px; border: 1px solid #ccc;"></div>
            <span>Nighttime Sun</span>
          </div>
        </div>
      `,a},e.addTo(c),()=>c.remove()},[a,b]),(0,d.jsx)("div",{id:"map",style:{height:"600px",width:"90%",margin:"0 auto"}})),k=f()(()=>Promise.resolve(j),{ssr:!1})}};