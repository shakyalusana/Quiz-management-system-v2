export type LoginResponse = {
  token: string;
  message: string;
  code: string;
  user: {
    name: string;
    userName: string;
    roles?: string[];
  };
};

export type RegisterResponse = {
  message: string;
  code: string;
  data: Omit<LoginResponse["data"], "accessToken">;
};

export type UserResponse = {
  message: string;
  code: string;
  data: User;
};

export interface VerifyOtpInput {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export interface ResendOtpResponse {
  message: string;
}
