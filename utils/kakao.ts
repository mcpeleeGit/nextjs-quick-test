import { logger } from './logger';

// 카카오 SDK 초기화
export const initializeKakao = async (): Promise<boolean> => {
  try {
    // 카카오 SDK가 이미 로드되어 있는지 확인
    if (typeof window !== 'undefined' && window.Kakao && window.Kakao.isInitialized()) {
      return true;
    }

    // 카카오 SDK 스크립트 로드
    if (typeof window !== 'undefined' && !window.Kakao) {
      const script = document.createElement('script');
      script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.0/kakao.min.js';
      script.async = true;
      
      return new Promise((resolve) => {
        script.onload = () => {
          // 테스트용 앱 키 (실제 사용시에는 본인의 앱 키로 교체)
          window.Kakao.init('2d68640b56d986af5c8a48505c7c8c71');
          logger.info('2d68640b56d986af5c8a48505c7c8c71');
          resolve(true);
        };
        script.onerror = () => {
          logger.error('카카오 SDK 로드 실패');
          resolve(false);
        };
        document.head.appendChild(script);
      });
    }

    return false;
  } catch (error) {
    logger.error('카카오 SDK 초기화 중 오류 발생:', error);
    return false;
  }
};

// 롤링페이퍼 공유하기 (피드 A형)
export const shareRollingPaper = async (
  userName: string,
  messageCount: number = 0
): Promise<boolean> => {
  const isInitialized = await initializeKakao();
  if (!isInitialized) {
    logger.error('카카오 SDK 초기화 실패');
    return false;
  }

  try {
    const shareUrl = `${window.location.origin}/rolling-paper/${encodeURIComponent(userName)}`;

    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `${userName}님의 롤링페이퍼`,
        description: `${userName}님에게 따뜻한 메시지를 남겨보세요! 현재 ${messageCount}개의 메시지가 있어요.`,
        imageUrl: `${window.location.origin}/bigLog.png`,
        link: {
          mobileWebUrl: shareUrl,
          webUrl: shareUrl,
        },
      },
      buttons: [
        {
          title: '메시지 남기기',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
      ],
    });

    return true;
  } catch (error) {
    logger.error('카카오톡 공유 실패:', error);
    return false;
  }
};
