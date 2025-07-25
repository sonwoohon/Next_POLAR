import { IContactRoomRepository } from '@/backend/chats/contactRooms/domains/repositories/IContactRoomRepository';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { IHelpImageRepository } from '@/backend/images/domains/repositories/IHelpImageRepository';
import { IUserRepository } from '@/backend/common/repositories/IUserRepository';
import { getNicknameByUuid } from '@/lib/getUserData';

// 상세 정보가 포함된 채팅방 목록 응답 DTO
export interface ContactRoomWithDetailsDto {
  contactRoomId: number;
  helpId?: number;
  juniorNickname: string;
  seniorNickname: string;
  createdAt: string;
  opponentProfile: {
    nickname: string;
    name: string;
    profileImgUrl: string;
  };
  latestHelp?: {
    id: number;
    title: string;
    category: { id: number; point: number }[];
    representativeImage: string;
    status: string;
  };
}

export interface ContactRoomListWithDetailsResponseDto {
  rooms: ContactRoomWithDetailsDto[];
  totalCount: number;
}

export class GetContactRoomsUseCase {
  constructor(
    private contactRoomRepo: IContactRoomRepository,
    private helpRepository: ICommonHelpRepository,
    private helpImageRepository: IHelpImageRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(
    nickname: string
  ): Promise<ContactRoomListWithDetailsResponseDto> {
    // 1. 사용자가 참여한 모든 연락방 조회
    const rooms = await this.contactRoomRepo.findRoomsByUserId(nickname);

    // 2. 각 연락방에 상세 정보 추가
    const roomsWithDetails = await Promise.all(
      rooms.map(async (room) => {
        // 3. 상대방 닉네임 결정
        const juniorNickname = await getNicknameByUuid(room.juniorId);
        const seniorNickname = await getNicknameByUuid(room.seniorId);

        const opponentNickname =
          juniorNickname === nickname ? seniorNickname : juniorNickname;

        // 4. 상대방 UUID 조회 (이미 room에서 가져온 UUID 사용)
        const opponentUuid =
          juniorNickname === nickname ? room.seniorId : room.juniorId;

        // 5. 상대방 프로필 정보 조회
        const opponentUser = opponentUuid
          ? await this.userRepository.getUserById(opponentUuid)
          : null;

        // 6. 최근 help 정보 조회
        const helpIds = await this.contactRoomRepo.findHelpIdsByContactRoomId(
          room.contactRoomId
        );

        let latestHelp = undefined;
        if (helpIds && helpIds.length > 0) {
          // 가장 최근 help 조회 (첫 번째 help)
          const help = await this.helpRepository.getHelpById(helpIds[0]);
          if (help) {
            // 대표 이미지 조회 (첫 번째 이미지)
            const images =
              await this.helpImageRepository.getHelpImageUrlsByHelpId(help.id);

            latestHelp = {
              id: help.id,
              title: help.title,
              category: help.category,
              representativeImage: images && images.length > 0 ? images[0] : '',
              status: help.status,
            };
          }
        }

        return {
          contactRoomId: room.contactRoomId,
          helpId: room.helpId,
          juniorNickname: juniorNickname || '알 수 없음',
          seniorNickname: seniorNickname || '알 수 없음',
          createdAt: room.createdAt,
          opponentProfile: {
            nickname:
              opponentUser?.nickname || opponentNickname || '알 수 없음',
            name: opponentUser?.name || '이름 없음',
            profileImgUrl: opponentUser?.profileImgUrl || '',
          },
          latestHelp,
        };
      })
    );

    return {
      rooms: roomsWithDetails,
      totalCount: roomsWithDetails.length,
    };
  }
}
