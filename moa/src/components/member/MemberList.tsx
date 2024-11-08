import React, {useState} from 'react';
import styled from 'styled-components/native';
import MemberListItem from './MemberListItem';
import {Profile} from '../../types/user';
import {FlatList} from 'react-native';

const Container = styled.View`
  width: 100%;
`;

const TitleLine = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
`;

const Title = styled.Text`
  font-family: SCDream5;
  font-size: 15px;
  margin-right: 10px;
`;

const TitleNum = styled(Title)<{darkColor: string}>`
  color: ${({darkColor}) => darkColor};
`;

interface MemberListProps {
  darkColor: string;
}

const MemberList = ({darkColor}: MemberListProps) => {
  const [containerWidth, setContainerWidth] = useState(0);

  const itemSize = (containerWidth - 3 * 15) / 4;

  //임시 멤버 데이터 -> 수정 예정
  const memberList: Profile[] = [
    {
      userId: 1,
      userName: '문선정',
      userImage: require('../../assets/images/logo.png'),
    },
    {
      userId: 2,
      userName: '김윤홍',
      userImage: require('../../assets/images/logo.png'),
    },
    {
      userId: 3,
      userName: '김주형',
      userImage: require('../../assets/images/logo.png'),
    },
    {
      userId: 4,
      userName: '민예림',
      userImage: require('../../assets/images/logo.png'),
    },
    {
      userId: 5,
      userName: '임세하',
      userImage: require('../../assets/images/logo.png'),
    },
  ];

  return (
    <Container
      onLayout={(event) => {
        const {width} = event.nativeEvent.layout;
        setContainerWidth(width);
      }}
    >
      <TitleLine>
        <Title>참여중인 멤버</Title>
        <TitleNum darkColor={darkColor}>{memberList.length}명</TitleNum>
      </TitleLine>
      <FlatList
        data={memberList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.userId.toString()}
        renderItem={({item}) => (
          <MemberListItem
            userName={item.userName}
            userImage={item.userImage}
            itemSize={itemSize}
          />
        )}
      />
    </Container>
  );
};

export default MemberList;
