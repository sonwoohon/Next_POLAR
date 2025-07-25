import { IContactRoomRepository } from '@/backend/chats/contactRooms/domains/repositories/IContactRoomRepository';
import { ICommonHelpRepository } from '@/backend/helps/domains/repositories/ICommonHelpRepository';
import { IHelpImageRepository } from '@/backend/images/domains/repositories/IHelpImageRepository';
import { IUserRepository } from '@/backend/common/repositories/IUserRepository';
import {
  ConnectedHelpDto,
  ContactRoomDetailResponseDto,
} from '@/backend/chats/contactRooms/applications/dtos/ContactRoomResponseDtos';
import { ContactRoomDtoMapper } from '../mappers/ContactRoomDtoMapper';
import { getUuidByNickname } from '@/lib/getUserData';

export class GetContactRoomDetailUseCase {
  constructor(
    private contactRoomRepo: IContactRoomRepository,
    private helpRepository: ICommonHelpRepository,
    private helpImageRepository: IHelpImageRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(
    contactRoomId: number,
    currentUserNickname: string
  ): Promise<ContactRoomDetailResponseDto | null> {
    // 1. 연락방 정보 조회
    const room = await this.contactRoomRepo.findRoomByContactRoomId(
      contactRoomId
    );
    if (!room) {
      return null;
    }

    // 2. 현재 사용자 UUID 조회
    const currentUserUuid = await getUuidByNickname(currentUserNickname);

    // 3. 상대방 UUID 결정
    const opponentUuid =
      room.juniorId === currentUserUuid ? room.seniorId : room.juniorId;

    // 4. 상대방 프로필 정보 조회
    const opponentUser = await this.userRepository.getUserById(opponentUuid);

    // 5. 연결된 helpId 목록 조회
    const helpIds = await this.contactRoomRepo.findHelpIdsByContactRoomId(
      contactRoomId
    );

    // 6. 첫 번째 help 정보만 조회 (Detail UseCase는 첫 번째만)
    const helps: ConnectedHelpDto[] = [];
    if (helpIds && helpIds.length > 0) {
      const firstHelpId = helpIds[0]; // 첫 번째 help만
      const help = await this.helpRepository.getHelpById(firstHelpId);
      if (help) {
        // 대표 이미지 조회 (첫 번째 이미지)
        const images = await this.helpImageRepository.getHelpImageUrlsByHelpId(
          firstHelpId
        );
        const representativeImage =
          images && images.length > 0 ? images[0] : '';

        helps.push({
          id: help.id,
          title: help.title,
          representativeImage,
          startDate: help.startDate.toISOString(),
          endDate: help.endDate.toISOString(),
          createdAt: help.createdAt.toISOString(),
          category: help.category,
        });
      }
    }

    // 7. 매퍼를 사용하여 Entity를 DTO로 변환 (review 데이터 없음)
    return ContactRoomDtoMapper.toDetailResponseDto(room, helps, {
      nickname: opponentUser?.nickname || '',
      name: opponentUser?.name || '',
      profileImgUrl: opponentUser?.profileImgUrl || '',
      address: opponentUser?.address || '',
    });
  }
}
