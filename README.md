# 콘서트 예약 서비스

## Milestone
![milestoneImg.png](assets%2FmilestoneImg.png)
> https://ryanwolf.notion.site/87ca3ab5e48e43f4bfb8ccd3f43784cd?v=101604bb36ac4b8081a4382b76c39bc9&pvs=4

## API 명세서
> https://ryanwolf.notion.site/API-3078289affc84517b75fd1c11590e3b1?pvs=4

## 시퀸스 다이어그램 작성
### 토큰 발급 API [POST] /client/token
```mermaid
sequenceDiagram
    actor  client as 사용자
    participant api as API
    participant token as 토큰
    participant user as 유저
    
    client ->> api: API 요청
    api ->> token: 토큰 발급 요청
    token ->> user: 유저 정보 저장
    user ->> token: 토큰 발급 요청
    token ->> client: 토큰 발급
```

### 콘서트 예약 가능 날짜 조회 API [GET] /concerts/{concertId}/dates
```mermaid
sequenceDiagram
    actor client as 사용자
    participant api as API
    participant token as 토큰
    participant concert as 콘서트 정보
    client ->> api: API 요청
    api ->> token: 토큰 검증 요청
    alt 유효하지않음
        token -->> client: 요청 실패
    else 유효함
        token ->> concert: 날짜 조회 요청
    end
    concert -->> client: 날짜 정보 반환

```

### 콘서트 좌석 정보 조회 API [GET] /concerts/{concertId}/dates/{concertDateId}/seats
```mermaid
sequenceDiagram
    actor client as 사용자
    participant api as API
    participant token as 토큰
    participant concert as 콘서트 정보
    client ->> api: API 요청
    api ->> token: 토큰 검증 요청
    alt 유효하지않음
        token -->> client: 요청 실패
    else 유효함
        token ->> concert: 좌석 정보 조회 요청
    end
    concert -->> client: 좌석 정보 반환
```

### 콘서트 좌석 예매 API [POST] /reservation
```mermaid
sequenceDiagram
    actor client as 사용자
    participant api as API
    participant token as 토큰
    participant concert as 콘서트 정보
    participant reservation as 예약
    client ->> api: API 요청
    api ->> token: 토큰 검증 요청
    alt 유효하지않음
        token -->> client: 요청 실패
    else 유효함
        token ->> concert: 좌석 정보 검증 요청
        alt 유효하지않음
            concert -->> client: 요청 실패
        else 유효함
            concert ->> reservation: 예약 요청
        end
    end
    reservation ->> concert: 예약 성공, 임시 배정
    concert ->> client: 예약 결과 반환

```

### 잔액 조회 API [GET] /client/{clientId}/balance
```mermaid
sequenceDiagram
    actor client as 사용자
    participant api as API
    participant token as 토큰
    participant point as 포인트
    
    client ->> api: API 요청
    alt 유효하지않음
        token -->> client: 요청 실패
    else 유효함
        token ->> point: 포인트 조회 요청
    end
    point ->> client: 포인트 잔액 반환

```

### 잔액 충전 API [PATCH] /user/{userId}/charge
```mermaid
sequenceDiagram
    actor client as 사용자
    participant api as API
    participant token as 토큰
    participant point as 포인트
    
    client ->> api: API 요청
    alt 유효하지않음
        token -->> client: 요청 실패
    else 유효함
        token ->> point: 포인트 충전 요청
    end
    point ->> client: 포인트 결과 반환

```

### 결제 요청 API [POST] /payment/{paymentId}
```mermaid
sequenceDiagram
    actor client as 사용자
    participant api as API
    participant token as 토큰
    participant reservation as 예약
    participant point as 포인트
    participant payment as 결제
    
    client ->> api: API 요청
    alt 유효하지않음
        token -->> client: 요청 실패
    else 유효함
        token ->> reservation: 예약 조회
    end
    alt 없는 예약 번호
        reservation -->> client: 요청 실패
    else 
        reservation ->> point: 포인트 잔액 조회 
    end
    alt 잔액 부족
        point -->> client: 요청 실패
    else
        point ->> payment: 결제 요청
    end
    payment ->> point: 결제 완료
    point ->> reservation: 결제 완료
    reservation ->> token: 대기열 완료
    token ->> client: 결제 결과 반환
```

## ERD
 ![erd.png](assets%2Ferd.png)
