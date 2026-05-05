// je type condition er upor nirvor kore

type A = null
type B = undefined

type C = A extends null ? true : B extends undefined ? true : false

//-----------
type CheckVehicle<T> = T extends 'bike' | 'car' | 'ship' ? true : false
type Hasbike = CheckVehicle<"cycle">
