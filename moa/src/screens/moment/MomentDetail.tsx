/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback, useEffect, useState} from 'react';
import ScreenContainer from '../../components/common/ScreenContainer';
import MemberList from '../../components/member/MemberList';
import styled from 'styled-components/native';
import MomentDetailHeader from '../../components/moment/momentDetail/MomentDetailHeader';
import Partition from '../../components/common/Partition';
import {
  HomeStackParamList,
  StackHeaderNavigationProp,
} from '../../types/screen';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import StackHeader from '../../components/common/header/StackHeader';
import AlbumContainer from '../../components/album/AlbumContainer';
import api from '../../utils/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {MomentInfoDetail} from '../../types/moment';
import {Alert} from 'react-native';
import PinPostModal from '../../components/common/modal/PinPostModal';
import {AxiosError} from 'axios';

const Container = styled.ScrollView.attrs({
  nestedScrollEnabled: true,
})`
  width: 100%;
`;

type MomentDetailRouteProp = RouteProp<HomeStackParamList, 'MomentDetail'>;

const MomentDetail: React.FC = () => {
  const navigation = useNavigation<StackHeaderNavigationProp>();
  const route = useRoute<MomentDetailRouteProp>();

  const [momentInfoDetail, setMomentInfoDetail] = useState<MomentInfoDetail>({
    id: '',
    groupId: '',
    momentPin: '',
    members: [],
    momentName: '',
    momentDescription: '',
    momentOwner: {userId: '', nickname: '', imageSrc: ''},
    createdAt: '',
    uploadOption: '',
  });
  const [loading, setLoading] = useState(false);
  const [isPinModalVisible, setIsPinModalVisible] = useState(false);

  const {momentId, momentName} = route.params.momentInfo || {
    momentId: '',
    momentName: '',
  };

  const toggleModal = useCallback(() => {
    setIsPinModalVisible((prev) => !prev);
  }, []);

  const getMomentDetail = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get(`/moment/${momentId}`);
      setMomentInfoDetail(response?.data);
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data.status === 403) {
        console.log(error.response.data.status);
        toggleModal();
      } else {
        Alert.alert('순간 조회 오류', '나의 순간 조회 중 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  }, [momentId, toggleModal]);

  useEffect(() => {
    getMomentDetail();
  }, [getMomentDetail]);

  useEffect(() => {
    if (momentName) {
      navigation.setOptions({
        header: () => <StackHeader title={momentName} />,
      });
    }
  }, [momentName, navigation]);

  return (
    <ScreenContainer>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Container>
          <MomentDetailHeader momentInfoDetail={momentInfoDetail} />
          <Partition />
          <MemberList
            owner={momentInfoDetail.momentOwner}
            memberList={momentInfoDetail.members}
          />
          <Partition />
          <AlbumContainer title="공유된 사진" momentId={momentId} />
        </Container>
      )}
      <PinPostModal
        momentId={momentInfoDetail.id}
        isModalVisible={isPinModalVisible}
        toggleModal={toggleModal}
        momentPin={momentInfoDetail.momentPin}
      />
    </ScreenContainer>
  );
};

export default MomentDetail;
