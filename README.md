완료

#

1. dxf파일 읽어오기

2. parser 사용하여 읽어온 dxf를 json형태로 변환하기

   1- 파일 선택후 파일 업로드 버튼을 선택취소로 나오게 하며 선택 취소시 input 의 value를 비워주기

3. json 형태로 변환된것을 바탕으로 레이어 생성하기

   1- blocks,entities,header,tables 중에 tables.layer.layers, entities 사용

4. 사용자로부터 적용할 좌표계 받을수 있게 하기 콤보박스 사용

   1- Header/ listener - handeler - setState(...state, coordSys) ->
   Map/ useEffect([state.coordSys]) -

   2- DxfContext.js 에 좌표계 관리 추가하기

   3- 수치지도\_377074 - 5186, 나머지 2개 5174

5. 파일 수정 버튼 누를시 기존 피쳐 삭제하기

진행

#

6. 각각의 레이어를 클릭시 선택 할 수 있게 적용

   1- 선택된 레이어를 우측의 영역에 표시할것?

   2- 라디오그룹으로 해야하는지? 기본적으로 모두 선택 해놓고 오른쪽에서 체크해제시 해당 피쳐 안보이게?

   3- 왼쪽 지도에서 선택시 어떤 반응?

7. 피쳐/피쳐컬랙션에 속성 집어넣기

   -1 현재 dxfObject에는 entities만 정리하여 들어가 있고 tables의 속성값들은 들어가 있지 않음 변경할것

8. MultiLineString 만으로 되어있는데 타입 분류할것

   -1 조건식 짜서 알아서 분리되게끔?

   -2 dxf에는 주로 insert 와 polyline 로 구성 되며 insert는 (Multi)Point 로 polyline은 MultiLineString으로 닫힌(시작점과 끝점이 같은) polyline만 MultiPolygon으로 분류

   -3 entities중에 type : "INSERT" 의 경우 vertices 가 아닌 position으로 표현됨

#

추가할 좌표계

5188=PROJCS["Korea 2000 / East Sea Belt 2010", GEOGCS["Korea 2000", DATUM["Geocentric datum of Korea", SPHEROID["GRS 1980", 6378137.0, 298.257222101, AUTHORITY["EPSG","7019"]], TOWGS84[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], AUTHORITY["EPSG","6737"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4737"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 131.0], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 200000.0], PARAMETER["false_northing", 600000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5188"]]
5187=PROJCS["Korea 2000 / East Belt 2010", GEOGCS["Korea 2000", DATUM["Geocentric datum of Korea", SPHEROID["GRS 1980", 6378137.0, 298.257222101, AUTHORITY["EPSG","7019"]], TOWGS84[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], AUTHORITY["EPSG","6737"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4737"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 129.0], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 200000.0], PARAMETER["false_northing", 600000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5187"]]
5186=PROJCS["Korea 2000 / Central Belt 2010", GEOGCS["Korea 2000", DATUM["Geocentric datum of Korea", SPHEROID["GRS 1980", 6378137.0, 298.257222101, AUTHORITY["EPSG","7019"]], TOWGS84[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], AUTHORITY["EPSG","6737"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4737"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 127.0], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 200000.0], PARAMETER["false_northing", 600000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5186"]]
5185=PROJCS["Korea 2000 / West Belt 2010", GEOGCS["Korea 2000", DATUM["Geocentric datum of Korea", SPHEROID["GRS 1980", 6378137.0, 298.257222101, AUTHORITY["EPSG","7019"]], TOWGS84[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], AUTHORITY["EPSG","6737"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4737"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 125.0], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 200000.0], PARAMETER["false_northing", 600000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5185"]]

5184=PROJCS["Korea 2000 / East Sea Belt", GEOGCS["Korea 2000", DATUM["Geocentric datum of Korea", SPHEROID["GRS 1980", 6378137.0, 298.257222101, AUTHORITY["EPSG","7019"]], TOWGS84[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], AUTHORITY["EPSG","6737"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4737"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 131.0], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 200000.0], PARAMETER["false_northing", 500000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5184"]]
5183=PROJCS["Korea 2000 / East Belt", GEOGCS["Korea 2000", DATUM["Geocentric datum of Korea", SPHEROID["GRS 1980", 6378137.0, 298.257222101, AUTHORITY["EPSG","7019"]], TOWGS84[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], AUTHORITY["EPSG","6737"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4737"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 129.0], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 200000.0], PARAMETER["false_northing", 500000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5183"]]
5182=PROJCS["Korea 2000 / Central Belt Jeju", GEOGCS["Korea 2000", DATUM["Geocentric datum of Korea", SPHEROID["GRS 1980", 6378137.0, 298.257222101, AUTHORITY["EPSG","7019"]], TOWGS84[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], AUTHORITY["EPSG","6737"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4737"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 127.0], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 200000.0], PARAMETER["false_northing", 550000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5182"]]
5181=PROJCS["Korea 2000 / Central Belt", GEOGCS["Korea 2000", DATUM["Geocentric datum of Korea", SPHEROID["GRS 1980", 6378137.0, 298.257222101, AUTHORITY["EPSG","7019"]], TOWGS84[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], AUTHORITY["EPSG","6737"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4737"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 127.0], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 200000.0], PARAMETER["false_northing", 500000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5181"]]
5180=PROJCS["Korea 2000 / West Belt", GEOGCS["Korea 2000", DATUM["Geocentric datum of Korea", SPHEROID["GRS 1980", 6378137.0, 298.257222101, AUTHORITY["EPSG","7019"]], TOWGS84[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], AUTHORITY["EPSG","6737"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4737"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 125.0], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 200000.0], PARAMETER["false_northing", 500000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5180"]]

5179=PROJCS["Korea 2000 / Unified CS", GEOGCS["Korea 2000", DATUM["Geocentric datum of Korea", SPHEROID["GRS 1980", 6378137.0, 298.257222101, AUTHORITY["EPSG","7019"]], TOWGS84[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0], AUTHORITY["EPSG","6737"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4737"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 127.5], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 0.9996], PARAMETER["false_easting", 1000000.0], PARAMETER["false_northing", 2000000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5179"]]
5178=PROJCS["Korean 1985 / Unified CS", GEOGCS["Korean 1985", DATUM["Korean Datum 1985", SPHEROID["Bessel 1841", 6377397.155, 299.1528128, AUTHORITY["EPSG","7004"]], TOWGS84[-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43], AUTHORITY["EPSG","6162"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4162"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 127.5], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 0.9996], PARAMETER["false_easting", 1000000.0], PARAMETER["false_northing", 2000000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5178"]]

5177=PROJCS["Korean 1985 / Modified East Sea Belt", GEOGCS["Korean 1985", DATUM["Korean Datum 1985", SPHEROID["Bessel 1841", 6377397.155, 299.1528128, AUTHORITY["EPSG","7004"]], TOWGS84[-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43], AUTHORITY["EPSG","6162"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4162"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 131.0028902777778], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 200000.0], PARAMETER["false_northing", 500000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5177"]]
5176=PROJCS["Korean 1985 / Modified East Belt", GEOGCS["Korean 1985", DATUM["Korean Datum 1985", SPHEROID["Bessel 1841", 6377397.155, 299.1528128, AUTHORITY["EPSG","7004"]], TOWGS84[-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43], AUTHORITY["EPSG","6162"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4162"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 129.0028902777778], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 200000.0], PARAMETER["false_northing", 500000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5176"]]
5175=PROJCS["Korean 1985 / Modified Central Belt Jeju", GEOGCS["Korean 1985", DATUM["Korean Datum 1985", SPHEROID["Bessel 1841", 6377397.155, 299.1528128, AUTHORITY["EPSG","7004"]], TOWGS84[-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43], AUTHORITY["EPSG","6162"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4162"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 127.0028902777778], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 200000.0], PARAMETER["false_northing", 550000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5175"]]
5174=PROJCS["Korean 1985 / Modified Central Belt", GEOGCS["Korean 1985", DATUM["Korean Datum 1985", SPHEROID["Bessel 1841", 6377397.155, 299.1528128, AUTHORITY["EPSG","7004"]], TOWGS84[-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43], AUTHORITY["EPSG","6162"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4162"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 127.0028902777778], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 200000.0], PARAMETER["false_northing", 500000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5174"]]
5173=PROJCS["Korean 1985 / Modified West Belt", GEOGCS["Korean 1985", DATUM["Korean Datum 1985", SPHEROID["Bessel 1841", 6377397.155, 299.1528128, AUTHORITY["EPSG","7004"]], TOWGS84[-115.80,474.99,674.11,1.16,-2.31,-1.63,6.43], AUTHORITY["EPSG","6162"]], PRIMEM["Greenwich", 0.0, AUTHORITY["EPSG","8901"]], UNIT["degree", 0.017453292519943295], AXIS["Geodetic longitude", EAST], AXIS["Geodetic latitude", NORTH], AUTHORITY["EPSG","4162"]], PROJECTION["Transverse_Mercator", AUTHORITY["EPSG","9807"]], PARAMETER["central_meridian", 125.0028902777778], PARAMETER["latitude_of_origin", 38.0], PARAMETER["scale_factor", 1.0], PARAMETER["false_easting", 200000.0], PARAMETER["false_northing", 500000.0], UNIT["m", 1.0], AXIS["Easting", EAST], AXIS["Northing", NORTH], AUTHORITY["EPSG","5173"]]

5186 proj4js https://epsg.io/5186

proj4.defs("EPSG:5186","+proj=tmerc +lat_0=38 +lon_0=127 +k=1 +x_0=200000 +y_0=600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
