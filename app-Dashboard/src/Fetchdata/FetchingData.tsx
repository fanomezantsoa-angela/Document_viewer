
export async function FetchingData(){
    const statData= await fetch("../../public/MockData/MockData.json");
    return statData.json();


}
