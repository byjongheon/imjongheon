---
title: Colophon
description: 이 블로그를 어떻게, 무엇으로, 어떤 생각으로 만들었는지 정리했습니다.
updated: 2026-10-29
lang: ko
---

개인적인 기록과 글을 장기간 보관하고 공개하기 위해 만든 공간입니다.

단순한 구조와 특정 플랫폼에 종속되지 않고 오래 운영할 수 있도록 노력했습니다.

## Design & Typography

디자인은 [Lipi](https://github.com/thelocalhoststudio/lipi) 테마를 기반으로 커스터마이징했습니다.

사용하는 글꼴은 다음과 같습니다.

- **Literata** — 본문
- **Manrope** — 인터페이스 및 내비게이션
- **Fira Code** — 코드

## Technology

다음 기술을 사용했습니다.

- **Astro** — 정적 사이트 생성(SSG)
  - **Lipi** — 블로그 디자인 및 기본 컴포넌트
- **Tailwind CSS** — 스타일링
- **Sanity** — 게시글 관리용 Headless CMS
- **Cloudflare Pages** — 웹사이트 호스팅 및 배포
- **GitHub** — 소스 코드 버전 관리
- **Pagefind** — 정적 사이트 검색
- **Cloudflare R2** — 이미지 파일 호스팅

## Publishing

Sanity Studio를 편집기로 사용합니다.

게시글을 발행하면 Webhook으로 Cloudflare Pages의 새로운 빌드가 실행됩니다.

Astro가 콘텐츠를 Static HTML로 생성하고, 완성된 페이지를 배포합니다.

상시 실행되는 웹 서버 없이 정적 사이트를 제공하는 구조입니다.

## Credits

이 블로그는 [The Localhost Studio](https://github.com/thelocalhoststudio)에서 개발한 오픈소스 Astro 테마 Lipi를 기반으로 제작했습니다.

Lipi의 원본 소스 코드는 [GitHub](https://github.com/thelocalhoststudio/lipi)에서 확인할 수 있습니다.