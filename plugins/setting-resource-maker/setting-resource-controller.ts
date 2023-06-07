import { ObjectId } from 'yongo';
import { ResourceController } from 'resource-maker';
import { IResourceBase } from 'resource-maker';
import { IResourceSettingsControllerContext } from './setting-resource-controller.d.ts';


export class SettingResourceController<T, TF extends IResourceBase> {

  constructor(private controller: ResourceController<T, TF>) {

  }


  private settingId?: ObjectId;

  private async ensureItem() {
    if (this.settingId) return;

    const item = await this.controller.findBy({});

    if (item) {
      this.settingId = item._id;
      return;
    }

    const newItem = await this.controller.create({
      document: {} as unknown as T
    });

    this.settingId = newItem._id;

  }

  public async retrieve(context: IResourceSettingsControllerContext<T, TF>): Promise<TF> {
    await this.ensureItem();

    return this.controller.retrieve({
      resourceId: this.settingId,
      selects: context.selects,
      populates: context.populates
    });

  }

  public async update(context: IResourceSettingsControllerContext<T, TF>): Promise<TF> {
    await this.ensureItem();

    return this.controller.update({
      resourceId: this.settingId,
      payload: context.payload
    });

  }

}
