export class Product{
    seller?:string;
    name:string;
    type:string;
    containers:number;
    itemsInContainer:number;
    height:number;
    weight: number;
    price?: number;
    minPrice?: number;
    blockPrice?: number;
    imagePath?:string;
    id?:string;
    auctionName:string;
    additionalInformation?: string;
}