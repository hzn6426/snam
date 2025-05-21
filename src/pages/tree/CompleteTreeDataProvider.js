export function CompleteTreeDataProvider(provider) {
   

  this.provider = provider;

  this.getTreeItem = async (itemId) => {
    return this.provider.getTreeItem(itemId);
  }

   this.getTreeItems = async (itemIds) => {
    return this.provider.getTreeItems
      ? this.provider.getTreeItems(itemIds)
      : Promise.all(itemIds.map(id => this.provider.getTreeItem(id)));
  }

   this.onChangeItemChildren = async(
    itemId,
    newChildren
  ) => {
    return this.provider.onChangeItemChildren?.(itemId, newChildren);
  }

   this.onDidChangeTreeData = function(listener)  {
    return this.provider.onDidChangeTreeData
      ? this.provider.onDidChangeTreeData(listener)
      : { dispose: () => {} };
  }

   this.onRenameItem = async (item, name) => {
    return this.provider.onRenameItem?.(item, name);
  }
}