import { context, PersistentMap, PersistentVector } from "near-sdk-as";
import { Constants, Result, Transfer, TransferStatus, ValidationFunction, ValidationInput, ValidationMethod } from "./models";
import { Money } from "./utils"

@nearBindgen
export class AutoTransfer {

  transfers: PersistentMap<string, Transfer> = new PersistentMap<string, Transfer>("t");
  ids: PersistentVector<string> = new PersistentVector<string>("ids");

  /**
   * @param receiver account to recieve the transfer
   * @param amount ammount to send the reciever 
   * @param date date afterwhich the transfer is valid in the following format (2020-07-10 15:00:00.000)
   */
  @mutateState()
  transferAfterDate(receiver: string, amount: Money, date: string): Transfer {
    let currentTime = context.blockTimestamp
    let id: string = (context.sender + '/' + currentTime.toString()).toUpperCase();

    let toNanoSec: u64 = 1000000;
    let timeStamp: u64 = Date.fromString(date).getTime() * toNanoSec;

    let validationInput: ValidationInput = new ValidationInput(
      timeStamp,
      0
    );

    let validationMethod: ValidationMethod = new ValidationMethod(
      Constants.AFTER_DATE_VALIDATION_NAME,
      Constants.AFTER_DATE_VALIDATION_DISC,
      ValidationFunction.AfterDate,
      validationInput,
      ''
    );

    let transfer: Transfer = new Transfer(
      id,
      context.sender,
      receiver,
      amount,
      TransferStatus.Posted,
      currentTime,
      validationMethod
    );

    this.transfers.set(id, transfer)
    this.ids.push(id);

    return transfer;
  }

  getAllTransfers(): Map<string, Transfer> {
    const res: Map<string, Transfer> = new Map<string, Transfer>();
    for (let i = 0; i < this.ids.length; i++) {
      res.set(this.ids[i], this.transfers.getSome(this.ids[i]));
    }
    return res;
  }

  getTransfersByMe(): Map<string, Transfer> {
    const res: Map<string, Transfer> = new Map<string, Transfer>();
    for (let i = 0; i < this.ids.length; i++) {
      if (context.sender == this.transfers.getSome(this.ids[i]).sender) {
        res.set(this.ids[i], this.transfers.getSome(this.ids[i]));
      }
    }
    return res;
  }

  getTransfersToMe(): Map<string, Transfer> {
    const res: Map<string, Transfer> = new Map<string, Transfer>();
    for (let i = 0; i < this.ids.length; i++) {
      if (context.sender == this.transfers.getSome(this.ids[i]).receiver) {
        res.set(this.ids[i], this.transfers.getSome(this.ids[i]));
      }
    }
    return res;
  }

  private _validateTransferDate(transfer: Transfer): bool {
    let transferDate: u64 = transfer.validationMethod.validationInput.transferDate;
    return transferDate < (context.blockTimestamp);
  };

  /**
   * @param id Transfer id you want to withdraw (call getUserTransfers method to view all your transfers)
   */
  @mutateState()
  validateTransfer(id: string): Map<string, string> {
    let transfer = this.transfers.getSome(id);
    // Make sure transfer is for the transaction sender
    if (transfer.receiver == context.sender) {
      // Make sure transfer status valid for withdrawal
      switch (transfer.status) {
        case TransferStatus.Cancelled:
          return new Result('failed', 'Transfer was canceled by the sender').toMap();
        case TransferStatus.Received:
          return new Result('failed', 'Transfer has been already recieved').toMap();
        case TransferStatus.Posted:
          {
            // Check transfer conditions
            switch (transfer.validationMethod.validationFunction) {
              case ValidationFunction.AfterDate: {
                if (this._validateTransferDate(transfer)) {
                  transfer.status = TransferStatus.Received;
                  this.transfers.delete(id);
                  this.transfers.set(id, transfer);
                  return new Result('success', 'Transfer validated').toMap();
                } else {
                  return new Result('failed', 'Transfer validation failed').toMap();
                }
              }
              case ValidationFunction.LostAccess: { }
              case ValidationFunction.External: { }
              default: {
                return new Result('failed', 'Unexpected error').toMap();
              }
            }
          }
      }
    }
    return new Result('failed', 'Transfer is not for you!').toMap();
  }

  /**
 * @param id Transfer id you want to cancel (call getUserTransfers method to view all your transfers)
 */
  @mutateState()
  cancelTransaction(id: string): Map<string, string> {
    let transfer = this.transfers.getSome(id);
    // Make sure transfer is for the transaction sender
    if (transfer.sender == context.sender) {
      // Make sure transfer status valid for cancelation
      switch (transfer.status) {
        case TransferStatus.Cancelled:
          return new Result('failed', 'Transfer has been already canceled').toMap();
        case TransferStatus.Received:
          return new Result('failed', 'Transfer has been already recieved').toMap();
        case TransferStatus.Posted:
          {
            transfer.status = TransferStatus.Cancelled;
            this.transfers.delete(id);
            this.transfers.set(id, transfer);
          }
      }
    }
    return new Result('failed', 'Transfer is not made by you!').toMap();
  }


}