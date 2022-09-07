데이터 업로드후에 update public.dxf_polygon set geom = st_makevalid(geom) 실행하여 데이터 체크할것

#

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

6. 각각의 레이어를 클릭시 선택 할 수 있게 적용

   1- 선택된 레이어를 우측의 영역에 표시할것?(레이어 선택시 ul-li 사용하여 우측에 표시는 하였지만 추가적인 기능 없음 + 스크롤 문제 해결 필요)

   2- 라디오그룹으로 해야하는지? => 체크박스를 사용하여 진행

   3- all 체크박스 누를경우 모두 체크(해제)되고 체크 된것과 안된것이 섞여있을경우 체크박스가 체크가 아닌 indeterminate 값을 true로 주어야함

   4- 기본적으로는 모두 체크되게하고 체크 해제시 그에 반응하여 지도의 레이어를 안보이게?

7. MultiLineString 만으로 되어있는데 타입 분류할것

   -1 조건식 짜서 알아서 분리되게끔?

   -2 dxf에는 주로 insert 와 polyline 로 구성 되며 insert는 (Multi)Point 로 polyline은 MultiLineString으로 닫힌(시작점과 끝점이 같은) polyline만 MultiPolygon으로 분류

   -3 entities중에 type : "INSERT" 의 경우 vertices 가 아닌 position으로 표현됨

8. layers 안에 setLayer 통해서 타입 집어넣어보기

   -1 Branch.js의 레이어 표시가 먼저 이루어진 후 Map.js의 레이어들의 타입구분이 진행됨

9. formatWFS.writeTransaction 으로 미리 생성한 레이어 3개에 레이어 넣기
   진행

10. 다운로드시 좌표계 문제 해결필요 설정한 좌표값으로 레이어좌표계에 집어넣어서 생기는것으로 추정 => 좌표계 변경을 안해서 그런것이였음

11. dxf파일 변환하여 만든 벡터레이어를 저장해야함 \
    -1 https://stackoverflow.com/questions/18740345/how-to-save-features-layer-in-openlayers \
    https://openlayers.org/en/latest/apidoc/module-ol_format_GeoJSON-GeoJSON.html#writeFeature \
    두개 참조해야? 방법 물어볼것

    -2 저장은 되긴 하는데 폴리곤과 라인만 됨 포인트 개선 필요 => 포인트 타입의 문제였음

#

1. 피쳐/피쳐컬랙션에 속성 집어넣기

   -1 현재 dxfObject에는 entities만 정리하여 들어가 있고 tables의 속성값들은 들어가 있지 않음 변경할것

   -2 https://vagran.github.io/dxf-viewer-example/ 와 색상이 다른데 값이 지정이 안되어 검은색으로 표시되던것을 하얀색으로 값을 줘서 그런것

   -3 색상을 제외한 나머지 속성들은 아직 못집어넣음

1. cors 해결 필요 proxy 걸고 일단 진행, 종종 프록시 걸어줬음에도 cors 발생

#
