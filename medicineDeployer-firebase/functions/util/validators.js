const isEmpty = (string) => {
	if (string.trim() === '') {
		return true
	}
	return false;
}

const isEmail = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)){ 
  	return true;
  }
  return false;
};

const isValidCpf = (strCPF) => {
	var sum;
    var remainder;
    sum = 0;
  	if (strCPF == "00000000000") return false;
     
  	for (i=1; i<=9; i++) sum = sum + parseInt(strCPF.substring(i-1, i)) * (11 - i);
  	remainder = (sum * 10) % 11;
   
    if ((remainder == 10) || (remainder == 11))  remainder = 0;
    if (remainder != parseInt(strCPF.substring(9, 10)) ) return false;
   
  	sum = 0;
    for (i = 1; i <= 10; i++) sum = sum + parseInt(strCPF.substring(i-1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
   
    if ((remainder == 10) || (remainder == 11))  remainder = 0;
    if (remainder != parseInt(strCPF.substring(10, 11) ) ) return false;
    return true;
};

exports.validateSignUpData = (data) => {
	let errors = {};

	if(isEmpty(data.email)){
		errors.email = 'Não pode ser vazio';
	} else if (!isEmail(data.email)){
		errors.email = 'Deve ser um endereço válido';
	}		

	if(isEmpty(data.password)){
		errors.password = 'Não pode ser vazio';
	}
	if(data.password !== data.confirmPassword){
		errors.confirmPassword = 'As senhas devem ser iguais'
	}
	if(isEmpty(data.login)){
		errors.login = 'Não pode ser vazio';
	}
	if(isEmpty(data.cpf)){
		errors.cpf = 'Não pode ser vazio';
	} else if (!isValidCpf(data.cpf)){
		errors.cpf = 'Deve ser um cpf válido';
	}
	if(data.profession === 'doctor'){
		if(isEmpty(data.crm)){
				errors.crm = 'Não pode ser vazio';
		}
	}
	if(isEmpty(data.hospital)){
		errors.hospital = 'Não pode ser vazio';
	}


	//Object is a javascript class
	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false
	}

} 


exports.validateLoginData = (data) => {
	let errors = {};

	if(isEmpty(data.email)){
		errors.email = 'Não pode ser vazio';
	} else if (!isEmail(data.email)){
		errors.email = 'Deve ser um endereço válido';
	}		
	
	if(isEmpty(data.password)){
		errors.password = 'Não pode ser vazio';
	}

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false
	}
}

exports.validateAddPatientData = (data) => {
	let errors = {};

	if(isEmpty(data.name)){
		errors.name = 'Não pode ser vazio';
	}
	if(isEmpty(data.email)){
		errors.email = 'Não pode ser vazio';
	} else if (!isEmail(data.email)){
		errors.email = 'Deve ser um endereço válido';
	}			
	if(isEmpty(data.cpf)){
		errors.cpf = 'Não pode ser vazio';
	} else if (!isValidCpf(data.cpf)){
		errors.cpf = 'Deve ser um cpf válido';
	}
	if(isEmpty(data.date_of_birth)){
		errors.date_of_birth = 'Escolha uma data';
	}
	if(isEmpty(data.aisle)){
		errors.aisle = 'Não pode ser vazio';
	}
	if(isEmpty(data.bed)){
		errors.bed = 'Não pode ser vazio';
	}
	if(isEmpty(data.city)){
		errors.city = 'Não pode ser vazio';
	}

	return {
		errors,
		valid: Object.keys(errors).length === 0 ? true : false
	}
}