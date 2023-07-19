interface INodeLink {
  evaluate: () => {};
  nodeId: string; // I think these are transient, but the object it points too should persist
  // also, how does this play out for things like .toJson() ?
}
export { INodeLink };
