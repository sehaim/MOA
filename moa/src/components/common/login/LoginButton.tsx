// src/components/common/login/LoginButton.tsx
import React, {useState, useEffect} from 'react';
import {Button, Alert, View, TouchableOpacity, Text} from 'react-native';
import {login, logout} from '@react-native-seoul/kakao-login';
import styled from 'styled-components/native';
import {TextButton} from '../button/TextButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useAuthStore} from '../../../stores/authStores';
import api from '../../../utils/api';
// type LoginButtonProps = {
//   onLoginSuccess: (kakaoToken: string) => void;
// };

const KakaoLoginButton = styled.Button`
  width: 200px;
  height: 50px;
  border-radius: 15px;
  background-color: #000000;
`;
const ButtonContainer = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 60px;
  border-radius: 15px;
  background-color: #fee500;
  padding: 10px;
`;

const ButtonText = styled(Text)`
  color: #3c1e1e;
  font-size: 16px;
  margin-left: 8px;
`;
// const LoginButton: React.FC<LoginButtonProps> = ({onLoginSuccess}) => {
const LoginButton = () => {
  // const handleKakaoLogin = async () => {
  //   try {
  //     const result = await kakaoLogin();
  //     const kakaoToken = result.accessToken;

  //     if (kakaoToken) {
  //       onLoginSuccess(kakaoToken);
  //     } else {
  //       throw new Error('카카오 토큰 발급 못받음!');
  //     }
  //   } catch (error) {
  //     console.error('카카오 로그인 실패', error);
  //     Alert.alert('로그인 실패', '다시 시도해주세용');
  //   }
  // };
  const [result, setResult] = useState<string | null>(null);
  const {setAuthenticated, logout: storeLogout} = useAuthStore();

  const signInWithKakao = async () => {
    try {
      const token = await login();
      const kakaoToken = token.accessToken;
      setResult(`Kakao Login Success: ${JSON.stringify(token)}`);

      if (kakaoToken) {
        console.log('토큰: ', result);
        console.log('access토큰: ', token.accessToken);
        console.log('refresh토큰: ', token.refreshToken);
        // onLoginSuccess(kakaoToken);
        await sendTokenToBackend(kakaoToken);
      } else {
        throw new Error('카카오 토큰 발급 못받음!');
      }
    } catch (error) {
      console.error('Login Failed', error);
      Alert.alert('로그인 실패', '다시 시도해주세요.');
    }
  };

  // 백엔드로 액세스 토큰 전송하고 JWT 받기
  const sendTokenToBackend = async (accessToken: string) => {
    try {
      // const response = await fetch('https://your-backend-url.com/auth/kakao', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({accessToken}),
      // });

      // if (!response.ok) {
      //   throw new Error('JWT Token 받기 실패');
      // }
      // const data = await response.json();
      // const jwtToken = data.token;

      // 토큰 바디에 담아서 보내는 방법
      // const response = await api.post('/auth/kakao', {accessToken});
      const response = await api.post(
        '/auth/kakao',
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (response.status !== 200) {
        throw new Error('JWT Token 받기 실패');
      }

      const jwtToken = response.data.token;

      if (jwtToken) {
        await setAuthenticated(true, jwtToken); // JWT 토큰 저장 및 전역 상태 업데이트
      }
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  };

  const signOutWithKakao = async () => {
    try {
      const message = await logout();
      setResult(`Kakao Logout: ${message}`);
      await storeLogout(); // 전역 상태와 AsyncStorage에서 JWT 토큰 제거
      console.log('로그아웃 결과: ', result, '토큰은? ', setResult);
    } catch (error) {
      console.error('Logout Failed', error);
      Alert.alert('로그아웃 실패', '다시 시도해주세요.');
    }
  };

  return (
    <View>
      {/* <KakaoLoginButton title="카카오 로그인mkm" onPress={signInWithKakao} />; */}

      <ButtonContainer onPress={signInWithKakao}>
        <Ionicons name="chatbubble-sharp" size={24} color="#3c1e1e" />
        <ButtonText>카카오 로그인</ButtonText>
      </ButtonContainer>

      <ButtonContainer onPress={signOutWithKakao}>
        <Ionicons name="chatbubble-sharp" size={24} color="#3c1e1e" />
        <ButtonText>카카오 로그아웃</ButtonText>
      </ButtonContainer>
    </View>
  );
};

export default LoginButton;
