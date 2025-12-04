import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { RegisterRequest } from '../../../contracts/register-request';
import { UserProfileDto } from '../../../contracts/user-profile-dto';
import { UpdateProfileRequest } from '../../../contracts/update-profile-request';
import { RegisterResponse } from '../../../contracts/register-response';
import { HttpClientService } from '../http-client.service';
import { GetAllUsersResponse } from '../../../contracts/get-all-users-response';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService) { }

  // 1. KULLANICI KAYDI (Register)
  async create(user: RegisterRequest): Promise<RegisterResponse> {
    const observable = this.httpClientService.post<RegisterResponse>({
      controller: "users",
      action: "register"
    }, user);

    return await firstValueFrom(observable);
  }

  // 2. KENDİ PROFİLİMİ GETİR (My Profile)
  async getMyProfile(): Promise<UserProfileDto> {
    const observable = this.httpClientService.get<UserProfileDto>({
      controller: "users",
      action: "my-profile"
    });

    return await firstValueFrom(observable);
  }

  // 3. PROFİL GÜNCELLEME
  async updateMyProfile(request: UpdateProfileRequest): Promise<{ success: boolean; message: string }> {
    const observable = this.httpClientService.put<{ success: boolean; message: string }>({
      controller: "users",
      action: "my-profile"
    }, request);

    return await firstValueFrom(observable);
  }

  // 4. BAŞKASININ PROFİLİNİ GETİR (Public Profile)
  async getPublicProfile(userId: string): Promise<UserProfileDto> {
    // userId'yi temizle ve doğrula
    const cleanUserId = userId?.trim();
    if (!cleanUserId || cleanUserId === 'undefined' || cleanUserId === 'null') {
      throw new Error('Geçersiz kullanıcı ID');
    }

    const observable = this.httpClientService.get<UserProfileDto>({
      controller: "users",
      action: "public-profile"
    }, cleanUserId); // ID URL'e eklenir: /api/users/public-profile/{userId}

    return await firstValueFrom(observable);
  }

  // 5. PROFİL RESMİ YÜKLEME
  async uploadProfileImage(file: File): Promise<{ succeeded: boolean; newProfileImageUrl: string }> {
    const formData = new FormData();
    formData.append("File", file, file.name);

    const observable = this.httpClientService.post<{ succeeded: boolean; newProfileImageUrl: string }>({
      controller: "users",
      action: "my-profile/upload-image"
    }, formData);

    return await firstValueFrom(observable);
  }

  // 6. TÜM KULLANICILARI GETİR (Admin - Filtreli)
  async getAllUsers(page: number = 0, size: number = 10, searchTerm?: string): Promise<GetAllUsersResponse> {
    let queryString = `page=${page}&size=${size}`;
    if (searchTerm) queryString += `&searchTerm=${searchTerm}`;

    const observable = this.httpClientService.get<GetAllUsersResponse>({
      controller: "users",
      queryString: queryString
    });

    return await firstValueFrom(observable);
  }

  // 7. KULLANICI SİLME (Admin)
  async deleteUser(id: string): Promise<void> {
    const observable = this.httpClientService.delete({
      controller: "users"
    }, id);

    await firstValueFrom(observable);
  }
}

