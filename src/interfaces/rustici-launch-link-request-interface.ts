export default interface ILaunchLinkRequest {
  expiry: number,
  redirectOnExitUrl: string,
  tracking?: boolean,
  startSco?: string,
  additionalValues?: [
    {
      item: string,
      value: string
    }
  ]
}
