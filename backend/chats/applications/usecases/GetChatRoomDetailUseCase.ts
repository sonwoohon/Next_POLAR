import { IChatRoomRepository } from '../../domains/repositories/IChatRoomRepository';
import { 
  GetChatRoomDetailRequestDto, 
  ChatRoomDetailResponseDto 
} from '../dtos/ChatRoomDtos';

export class GetChatRoomDetailUseCase {
  constructor(private chatRoomRepo: IChatRoomRepository) {}

  // helpId로 대화방 1개 정보 반환
  async execute(request: GetChatRoomDetailRequestDto): Promise<ChatRoomDetailResponseDto | null> {
    const room = await this.chatRoomRepo.findRoomByHelpId(request.helpId);
    
    if (!room) {
      return null;
    }

    // TODO: 실제 구현에서는 사용자 정보와 헬프 정보를 가져와야 함
    return {
      helpId: room.helpId,
      juniorId: room.juniorId,
      seniorId: room.seniorId,
      createdAt: room.createdAt,
      participants: {
        junior: {
          id: room.juniorId,
          name: '', // TODO: 사용자 정보에서 가져와야 함
          profileImgUrl: '' // TODO: 사용자 정보에서 가져와야 함
        },
        senior: {
          id: room.seniorId,
          name: '', // TODO: 사용자 정보에서 가져와야 함
          profileImgUrl: '' // TODO: 사용자 정보에서 가져와야 함
        }
      },
      helpInfo: {
        title: '', // TODO: 헬프 정보에서 가져와야 함
        description: '', // TODO: 헬프 정보에서 가져와야 함
        status: '' // TODO: 헬프 정보에서 가져와야 함
      }
    };
  }
} 