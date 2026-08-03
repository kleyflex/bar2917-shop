import { instance } from "@/app/api/api.interceptor";
import { IUser } from "../types/user.interface";



const USERS = 'users'

type TypeData = {
    email: string
    name?: string
    password?: string
    phone?: string
}

export const UserService = {
  async getProfile(){
    return instance<IUser>({
      url: `${USERS}/profile`,
      method: 'GET'
    })
  },

  async updateProfile(data: TypeData) {
    return instance<IUser>({
      url: `${USERS}/profile`,
      method: 'PUT',
      data
    })
  },

  async delete(id: string | number) {
    return instance<IUser>({
      url: `${USERS}/${id}`,
      method: 'DELETE'
    })
  }
}

