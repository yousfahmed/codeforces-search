import { MDBCardText, MDBListGroupItem, MDBCol } from "mdb-react-ui-kit";

export default function Contest(props) {
  let url =
    "https://codeforces.com/" +
    (props.link === "Rounds" ? "contest/" : "gym/") +
    props.id;
  return (
    <MDBListGroupItem className="d-flex align-items-center p-3">
      <MDBCol size="1">{props.Key}</MDBCol>
      <MDBCol size="5">
        <MDBCardText className="text-wrap">
          <a href={url} target="_blank">
            {props.name}
          </a>
        </MDBCardText>
      </MDBCol>
      <MDBCol size="3">
        <MDBCardText className="text-wrap">
          <strong className="ps-3" style={{ color: "#21130d" }}>
            {props.time}
          </strong>
        </MDBCardText>
      </MDBCol>
      <MDBCol size="3">
        <MDBCardText className="text-wrap">{props.type}</MDBCardText>
      </MDBCol>
    </MDBListGroupItem>
  );
}
