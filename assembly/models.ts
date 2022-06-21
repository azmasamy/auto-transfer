import { AccountId, Money } from "./utils";

export enum TransferStatus {
  Posted,
  Received,
  Cancelled
}

export enum ValidationType {
  Internal,
  External
}

export class Constants {
  static AFTER_DATE_VALIDATION_NAME:string = 'Transfer After Date';
  static AFTER_DATE_VALIDATION_DISC:string = 'Check if the given date is after the current date';
}

export class Result {
  status:string;
  message:string;

  constructor(
    status:string,
    message:string
  ) {
    this.status = status;
    this.message = message;
  }

  toMap():Map<string,string> {
    let resultMap = new Map<string,string>();
    resultMap.set('status', this.status);
    resultMap.set('message', this.message);
    return resultMap;
  }
}

@nearBindgen
export class ValidationInput{
  transferDate:u64;
  inactiveDays:number;
  
  constructor(
    transferDate: u64 = u64.MIN_VALUE,
    inactiveDays: number = 0
  ) {
    this.transferDate = transferDate;
    this.inactiveDays = inactiveDays;
  }
}

@nearBindgen
export class ValidationMethod{
  name:string;
  description:string;
  validationType:ValidationType;
  validationInput:ValidationInput;
  internalValidationMethod:Function;
  externalValidationMethodName:string;

  constructor(
    name: string,
    description: string,
    validationType: ValidationType,
    validationInput: ValidationInput,
    internalValidationMethod: Function,
    externalValidationMethodName: string = '',
  ) {
    this.name = name;
    this.description = description;
    this.validationType = validationType;
    this.validationInput = validationInput;
    this.internalValidationMethod = internalValidationMethod;
    this.externalValidationMethodName = externalValidationMethodName;
  }
}

@nearBindgen
export class Transfer{
  id:string;
  sender:AccountId;
  receiver:AccountId;
  amount:Money;
  status:TransferStatus;
  time:u64;
  validationMethod:ValidationMethod;
  
  constructor(
    id: string,
    sender:AccountId,
    reciever:AccountId,
    amount:Money,
    status:TransferStatus,
    date:u64,
    validationMethod:ValidationMethod
  ) {
    this.id = id;
    this.sender = sender;
    this.receiver = reciever;
    this.amount = amount;
    this.status = status;
    this.time = date;
    this.validationMethod = validationMethod;
  }
}