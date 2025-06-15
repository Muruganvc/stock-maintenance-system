import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/compat/database';
import { IUser } from '../models/IUser';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly dbPath = '/user';
  private readonly userRef: AngularFireList<IUser>;

  constructor(private db: AngularFireDatabase) {
    this.userRef = this.db.list<IUser>(this.dbPath);
  }

  getAll(): AngularFireList<IUser> {
    return this.userRef;
  }

  getById(id: string): AngularFireObject<IUser> {
    return this.db.object<IUser>(`${this.dbPath}/${id}`);
  }

  create(user: IUser): Promise<void> {
    const newRef = this.userRef.push({
      id: '',
      emailId: user.emailId,
      firstName: user.firstName,
      isActive: user.isActive,
      lastName: user.lastName,
      mobileNumber: user.mobileNumber,
      password: user.password,
      role: user.role,
      superAdmin: user.superAdmin,
      userName: user.userName
    });
    return newRef.set({ ...user });
  }

  getByUserName(name: string): AngularFireList<IUser> {
    return this.db.list<IUser>(this.dbPath, ref =>
      ref.orderByChild('userName').equalTo(name)
    );
  }

  update(id: string, user: Partial<IUser>): Promise<void> {
    return this.userRef.update(id, user);
  }

  delete(id: string): Promise<void> {
    return this.userRef.remove(id);
  }
}
