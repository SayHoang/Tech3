import { gql } from "@apollo/client";

// Upload file mutation
export const UPLOAD_FILE = gql`
  mutation UploadFile($file: File!) {
    upload(file: $file)
  }
`;
