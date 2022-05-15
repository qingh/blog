//以下是测试数据
import { action, computed, observable } from 'mobx';

class UserStore {
  @observable num = 1;
  @computed get getNum() {
    return this.num;
  }
  @action add() {
    this.num++;
  }
}

let userStore = new UserStore();

export default userStore;
