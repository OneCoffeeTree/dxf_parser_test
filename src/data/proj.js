import proj4 from "proj4";
const defsData = [
    [
        'EPSG:3857',
        '+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs'
    ],
   //  [
   //     'EPSG:4326',
   //     '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
   //  ],
    [
       'EPSG:5173',
       '+proj=tmerc +lat_0=38 +lon_0=125.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs'
    ],
    [
       'EPSG:5174',
       '+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs' // 전라남도_담양군_고서면_산덕리_산19_28.dxf
    ],
    [
       'EPSG:5175',
       '+proj=tmerc +lat_0=38 +lon_0=127.0028902777778 +k=1 +x_0=200000 +y_0=550000 +ellps=bessel +units=m +no_defs'
    ],
    [
       'EPSG:5176',
       '+proj=tmerc +lat_0=38 +lon_0=129.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs'
    ],
    [
       'EPSG:5177',
       '+proj=tmerc +lat_0=38 +lon_0=131.0028902777778 +k=1 +x_0=200000 +y_0=500000 +ellps=bessel +units=m +no_defs'
    ],
    [
       'EPSG:5178',
       '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=bessel +units=m +no_defs'
    ],
    [
       'EPSG:5179',
       '+proj=tmerc +lat_0=38 +lon_0=127.5 +k=0.9996 +x_0=1000000 +y_0=2000000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    ],
    [
       'EPSG:5180',
       '+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    ],
    [
       'EPSG:5181',
       '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    ],
    [
       'EPSG:5182',
       '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=550000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    ],
    [
       'EPSG:5183',
       '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    ],
    [
       'EPSG:5184',
       '+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    ],
    [
       'EPSG:5185',
       '+proj=tmerc +lat_0=38 +lon_0=125 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    ],
    [
       'EPSG:5186',
       '+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs' // 수치지도_377074.dxf
    ],
    [
       'EPSG:5187',
       '+proj=tmerc +lat_0=38 +lon_0=129 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    ],
    [
       'EPSG:5188',
       '+proj=tmerc +lat_0=38 +lon_0=131 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
    ]
 ]
const proj = ()  => {
    
    proj4.defs(defsData);
     return proj
}

export {
    proj, 
    defsData, 
}