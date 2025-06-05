import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  username: string;
}

export class AuthResponse {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: UserResponse })
  user: UserResponse;
}
