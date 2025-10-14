'use client';

import { useState } from 'react';
import { shareRollingPaper } from '@/utils/kakao';

interface RollingPaperShareProps {
  userName: string;
  messageCount?: number;
}

export default function RollingPaperShare({ 
  userName, 
  messageCount = 0 
}: RollingPaperShareProps) {
  const [isSharing, setIsSharing] = useState(false);
  const [shareResult, setShareResult] = useState<string>('');

  const handleShare = async () => {
    setIsSharing(true);
    setShareResult('');

    try {
      const success = await shareRollingPaper(userName, messageCount);
      
      if (success) {
        setShareResult('카카오톡 공유가 성공적으로 실행되었습니다!');
      } else {
        setShareResult('카카오톡 공유에 실패했습니다. 카카오 SDK 초기화를 확인해주세요.');
      }
    } catch (error) {
      setShareResult(`공유 중 오류가 발생했습니다: ${error}`);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        롤링페이퍼 공유 테스트
      </h2>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          <strong>사용자명:</strong> {userName}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          <strong>메시지 수:</strong> {messageCount}개
        </p>
      </div>

      <button
        onClick={handleShare}
        disabled={isSharing}
        className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
          isSharing
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'bg-yellow-400 hover:bg-yellow-500 text-black'
        }`}
      >
        {isSharing ? '공유 중...' : '카카오톡으로 공유하기'}
      </button>

      {shareResult && (
        <div className={`mt-4 p-3 rounded-md text-sm ${
          shareResult.includes('성공') 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {shareResult}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-md">
        <p className="text-xs text-blue-800">
          <strong>참고:</strong> 실제 카카오톡 공유를 위해서는 카카오 개발자 콘솔에서 
          앱을 등록하고 발급받은 JavaScript 키를 utils/kakao.ts 파일의 
          YOUR_KAKAO_APP_KEY 부분에 입력해주세요.
        </p>
      </div>
    </div>
  );
}
