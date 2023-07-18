interface IAPIError {
  errorProps: ErrorProps;
  getError: () => ErrorProps;
}

type ErrorProps = {
  code: number;
  label: string;
  description: string;
  details?: string;
};

class APIError implements IAPIError {
  public errorProps: ErrorProps;
  constructor(errorProps: ErrorProps) {
    this.errorProps = errorProps;
  }
  getError() {
    return this.errorProps;
  }
}

export default APIError;
