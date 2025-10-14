'use client';

import { useState } from 'react';
import RollingPaperShare from '@/components/RollingPaperShare';

export default function Home() {
  const [userName, setUserName] = useState('홍길동');
  const [messageCount, setMessageCount] = useState(5);

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          카카오톡 롤링페이퍼 공유 테스트
        </h1>

        <div className="max-w-2xl mx-auto">
          {/* 설정 패널 */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              테스트 설정
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-1">
                  사용자명
                </label>
                <input
                  id="userName"
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="사용자명을 입력하세요"
                />
              </div>

              <div>
                <label htmlFor="messageCount" className="block text-sm font-medium text-gray-700 mb-1">
                  메시지 수
                </label>
                <input
                  id="messageCount"
                  type="number"
                  value={messageCount}
                  onChange={(e) => setMessageCount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* 공유 컴포넌트 */}
          <RollingPaperShare 
            userName={userName} 
            messageCount={messageCount} 
          />

          {/* 사용법 안내 */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">
              사용법 안내
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
              <li>위의 설정에서 사용자명과 메시지 수를 조정할 수 있습니다.</li>
              <li>"카카오톡으로 공유하기" 버튼을 클릭하면 카카오톡 공유 창이 열립니다.</li>
              <li>실제 카카오톡 공유를 위해서는 카카오 개발자 콘솔에서 앱을 등록하고 JavaScript 키를 발급받아야 합니다.</li>
              <li>발급받은 키를 <code className="bg-blue-200 px-1 rounded">utils/kakao.ts</code> 파일의 <code className="bg-blue-200 px-1 rounded">YOUR_KAKAO_APP_KEY</code> 부분에 입력하세요.</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}
