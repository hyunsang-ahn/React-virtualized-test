# 1. 폴더 구조

│  │  ├─scripts
│  │  │  │  index.jsx
│  │  │  │  
│  │  │  ├─components
│  │  │  │  │  App.jsx
│  │  │  │  │  
│  │  │  │  └─Home
│  │  │  │      │  Help.jsx
│  │  │  │      │  Portal.jsx
│  │  │  │      │  TestPage.jsx
│  │  │  │      │  
│  │  │  │      ├─Category
│  │  │  │      │      CategoryOnlinemall.jsx
│  │  │  │      │      CategoryOnlinemallDetail.jsx
│  │  │  │      │      CategoryProduct.jsx
│  │  │  │      │      CategoryProductDetail.jsx
│  │  │  │      │      
│  │  │  │      ├─Common
│  │  │  │      │      AdultBlock.jsx
│  │  │  │      │      Banner.jsx
│  │  │  │      │      BannerList.jsx
│  │  │  │      │      Cover.jsx
│  │  │  │      │      Error.jsx
│  │  │  │      │      SearchBar.css
│  │  │  │      │      SearchBar.jsx
│  │  │  │      │      SubnameBar.jsx
│  │  │  │      │      
│  │  │  │      ├─Goods
│  │  │  │      │      Goods.jsx
│  │  │  │      │      GoodsList.jsx
│  │  │  │      │      GoodsListObject.jsx
│  │  │  │      │      Product.jsx
│  │  │  │      │      
│  │  │  │      ├─Home_Main
│  │  │  │      │      Home.jsx
│  │  │  │      │      LowestPriceItem.jsx
│  │  │  │      │      LowestPriceItemList.jsx
│  │  │  │      │      RankingItem.jsx
│  │  │  │      │      RankingItemList.jsx
│  │  │  │      │      RankingItemListObject.jsx
│  │  │  │      │      RecommandItem.jsx
│  │  │  │      │      RecommandItemList.jsx
│  │  │  │      │      SubnameBar.jsx
│  │  │  │      │      
│  │  │  │      ├─Onlinemall
│  │  │  │      │      Onlinemall.jsx
│  │  │  │      │      OnlinemallList.jsx
│  │  │  │      │      Onlinemall_detail.jsx
│  │  │  │      │      
│  │  │  │      ├─Ranking
│  │  │  │      │      Ranking.jsx
│  │  │  │      │      RankingList.jsx
│  │  │  │      │      
│  │  │  │      └─Search
│  │  │  │              SearchObject.jsx
│  │  │  │              SearchPage.jsx
│  │  │  │              SearchPageBar.jsx
│  │  │  │              
│  │  │  └─utils
│  │  │          styles.js
│  │  │          util.js
│  │  │          
│  │  └─styles
│  │          App.jsx
│  │          core.scss
│  │          layout.react.css
│  │          pagination.scss
│  │          pseudo.scss
│  │          Test.scss



# 2. 구조 설명

- script 폴더 - index.jsx - react dom을 html 에 뿌려주는 역할 / App.jsx를 호출
- script 폴더 - component 폴더 - App.jsx - 기존 모든 페이지의 라우터와 초기 실행시의 app 과의 interaction 에 대한 정보를 호출 및 저장
- script 폴더 - utils 폴더 - util.jsx - 모든 유틸 함수를 담고 있음.
- script 폴더 - component 폴더 - Home 폴더 - 메인 홈에 대한 모든 컴포넌트를 담고 있는 폴더

### script 폴더 - component 폴더 - Home 폴더

### 1. Category 폴더

- 홈(메인) - 상품,온라인몰 탭 좌측 상단 컨트롤 아이콘을 누르면 이동되는 카테고리에 대한 폴더
- CategoryOnlinemall.jsx - 온라인몰 카테고리 관련 컴포넌트
- CategoryOnlinemallDetail.jsx - 온라인몰 카테고리 결과페이지 컴포넌트
- CategoryProduct.jsx - 상품 카테고리 관련 컴포넌트
- CategoryProductDetail.jsx - 상품 카테고리 결과페이지 관련 컴포넌트

### 2. Home_Main 폴더

- 홈(메인) - 홈 관련 컴포넌트를 모아놓은 폴더

### 3. Ranking폴더

- 홈(메인) - 랭킹 관련 컴포넌트를 모아놓은 폴더

### 4. Goods폴더

- 홈(메인) - 상품 관련 컴포넌트를 모아놓은 폴더

### 5. Onlinemall폴더

- 홈(메인) - 온라인몰 관련 컴포넌트를 모아놓은 폴더


### 6. Common폴더

- 홈(메인)에서 공통적으로 사용하는 컴포넌트들을 모아놓은 폴더
- AdultBlock.jsx - 성인인증 관련 cover 이미지 등장 컴포넌트(각 mode 별로 분기처리)
- Banner.jsx - 배너(자동 이동 스와이프) 기능을 갖춘 배너 컴포넌트
- BannerList.jsx - 각 배너에 들어가는 배너 이미지 1개씩에 대한 컴포넌트
- Cover.jsx - 초기 페이지 등장 이전 로딩 스피너 관련 컴포넌트
- Error.jsx - 네트워크 에러시 등장하는 네트워크 에러 페이지 컴포넌트
- SearchBar.css - 상품 바에 대한 css(scss에 포함되지 않는 특정 부분만 작성)
- SearchBar.jsx - 상품, 온라인몰 상단의 검색 Bar 및 컨트롤 패널, 돋보기 아이콘 등을 포함한 검색 컴포넌트
- SubnameBar.jsx - 캐시카우 랭킹, 추천상품 등의 페이지 중간에 나타나는 제목에 관련된 컴포넌트입니다.

### 7. Search폴더

- 상품, 온라인몰 탭의 Search bar를 클릭하면 통합검색페이지로 이동하며, 통합검색 페이지를 구성하는 컴포넌트를 모아놓은 폴더


### 8. 기타 컴포넌트(Portal/TestPage/Help)

- script 폴더 - component 폴더 - Home 폴더 에서 사용됨.

