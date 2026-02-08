
export async function FetchingDataProcess(){
    const statData= await fetch("../../public/MockData/MockData.json");
    return statData.json();


}
export async function FetchingDataPerformence(){
    const performenceData= await fetch("../../public/MockData/Performence.json");
    return performenceData.json();


}