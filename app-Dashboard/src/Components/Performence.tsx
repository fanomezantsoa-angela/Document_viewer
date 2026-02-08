import {useState, useEffect, useMemo} from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Typography, TextField, Button} from "@mui/material";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { FetchingDataPerformence } from "../Fetchdata/FetchingData";
export default function(){
    const [Performence, setPerformence]=useState<any[]>([])
    const [searchQuery, setSearchQuery]=useState("")
    const [sortKey, setSortKey]=useState("entity_type")
    const [sortType, setSortType]=useState<"asc"|"desc">("asc")
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    color: theme.palette.text.secondary,
    fontWeight: 500,
    '&.MuiTableCell-head': {
      backgroundColor: theme.palette.primary.light + '20',
      fontWeight: 700,
    }
  }));
  function perfColoring(score: number){
    if(score > 0.9){
        return {backgroundColor: "green"}
    }
    else if(score <=0.9 || score >=80 ){
        return {backgroundColor: "orange"}

    }else{
        return {backgroundColor: "orange"}
    }

  }
  function sortEntity(key:string){
    if(key === sortKey){
        setSortType(sortType== "asc" ? "desc" : "asc")
    }
    else{
        setSortKey(key)
        setSortType("asc")
    }

  }



  useEffect(()=>{
    async function Fetchdata(){
  
   
      const performData = await FetchingDataPerformence();
      if (performData) {
        setPerformence(performData.entities)
       
      } else {
        return;
    
      }
    
    }
    Fetchdata()
  }, []);

   const sortedPerf = useMemo(() => { 
    return [...Performence].sort((a, b) => { 
        const x = a[sortKey]; 
        const y = b[sortKey]; 
        if (x < y) return sortType === "asc" ? -1 : 1; 
        if (x > y) return sortType === "asc" ? 1 : -1; 
        return 0;
     }); 

    }, [Performence, sortKey, sortType]);
    const filteredPerf = sortedPerf.filter((row) => 
    row.entity_type.toLowerCase().includes(searchQuery.toLowerCase()) );
   function CSVexporting() { 
    const header = ["Entity Type", "Precision", "Recall", "F1 Score", "Extracted Count"]; 
    const rows = filteredPerf.map((per) => [ 
        per.entity_type, 
        per.precision, 
        per.recall, 
        per.f1_score, 
        per.extracted_count ]); 
        const csv = [header, ...rows].map((r) => r.join(",")).join("\n"); 
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" }); 
        const url = URL.createObjectURL(blob); 
        const a = document.createElement("a"); a.href = url; 
        a.download = "entity_performance.csv"; 
        a.click(); URL.revokeObjectURL(url); }


    return(
        <Paper sx={{ width: "100%", overflow: "hidden", boxShadow: 3, borderRadius: 2,   height: "50vh",}}>
            <div className="m-4"> 
                  <TextField label="Search entity type" variant="outlined" size="small" value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)}
                    />
                <Button onClick={CSVexporting}> Export CSV</Button>
            </div>
  




          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader sx={{ minWidth: 600 }} aria-label="documents table">
              <TableHead>
                <TableRow>
                 
                  
                  <StyledTableCell align="center"  onClick={() => sortEntity("entity_type")}>Entity Type</StyledTableCell>
                  <StyledTableCell align="center"   onClick={() => sortEntity("precision")}>Precision</StyledTableCell>
                  <StyledTableCell align="center"  onClick={() => sortEntity("recall")}>Recall</StyledTableCell>
                  <StyledTableCell align="center" onClick={() => sortEntity("f1_score")}>F1-Score</StyledTableCell>
                  <StyledTableCell align="center" onClick={() => sortEntity("extracted_count")}>Extracted count</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPerf.length ==0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography variant="body1" sx={{ py: 2 }}>
                        No data loaded
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                filteredPerf.map((row: any) => (
                    <TableRow key={row.type} hover>
                     
                      <StyledTableCell align="center">{row.entity_type}</StyledTableCell>
                      <StyledTableCell align="center" sx={perfColoring(row.precision)}>  {(row.precision * 100).toFixed(1)}% </StyledTableCell>
                      <StyledTableCell align="center" sx={perfColoring(row.recall)}> {(row.recall * 100).toFixed(1)}%</StyledTableCell>
                      <StyledTableCell align="center" sx={perfColoring(row.f1_score)}> {(row.f1_score * 100).toFixed(1)}%</StyledTableCell>
                      <StyledTableCell align="center">{row.extracted_count}</StyledTableCell>
                   
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

        </Paper>



    )


}