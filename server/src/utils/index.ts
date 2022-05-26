const response = {
  resSuccess: {
    errorCode: 1,
    message: 'success'
  },
  resError: {
    errorCode: 0,
    message: 'Unexpected error'
  }
}

function handlError(err: Error) {
  let msg = 'Unexpected error'
  if (err instanceof Error) msg = err.message
  return {
    ...response.resError,
    message: msg
  }
}

export {
  response,
  handlError
}
