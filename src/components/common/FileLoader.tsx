import { buttonLikeBaseStyle } from './styles.js';
import styled from 'styled-components';

const FileUploadLabel = styled.label`
  ${buttonLikeBaseStyle}
`;

type FileLoaderProps = {
  label: string;
  getSelectedFiles: (files: File[]) => void;
  allowedFileExtensions?: string[];
};

export const FileLoader = ({ label, getSelectedFiles, allowedFileExtensions = [] }: FileLoaderProps) => {
  const acceptAttribute = allowedFileExtensions.length > 0 ? { accept: allowedFileExtensions.join(',') } : {};

  return (
    <>
    <FileUploadLabel>
      {label ?? 'Upload'}
      <input
        type='file'
        {...acceptAttribute}
        hidden
        onChange={(event) => {
          try {
            const files = event.target.files === null ? [] : [...event.target.files];
            getSelectedFiles(files);
          } finally {
            // When uploading the same file again, the onchange event will not fire. This fixes the issue.
            event.target.value = '';
          }
        }}
      />
    </FileUploadLabel>
    </>
  );
};
