const base64Table = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
let flag


function atob() {
    let textArea = document.getElementById('input1')
    let input = textArea.value
    document.getElementById('error-box').style.display = 'none'

    if (textArea.classList.contains('error')) {
        textArea.classList.remove('error')
        textArea.value = ''
        document.getElementById('input2').value = ''
        return
    }
    let binaryCode = stringToEightBit(input)
    let sixBitGroup = binaryToSixBit(binaryCode)
    let encodedString = readSixBits(sixBitGroup)
    document.getElementById('input2').value = encodedString
}


function btoa() {
    let input = document.getElementById('input2').value
    let binaryCode = numberToSixBitBinary(input)
    let eightBitGroup = binaryToEightbit(binaryCode)
    let decodedString = readEightBits(eightBitGroup)
    document.getElementById('input1').value = decodedString

}



function stringToEightBit(string) {
    if (!string) {
        document.getElementById('input2').value = ''
        return
    }
    const binaryCode = []

    for (let i = 0; i < string.length; i++) {
        let charCode = string.charCodeAt(i)
        // convert character number to 8 bit
        for (let j = 7; j >= 0; j--) {
            let quotient = Math.floor(charCode / 2 ** j)
            charCode = charCode % (2 ** j)
            binaryCode.push(quotient)
        }
    }
    return binaryCode
}


function binaryToSixBit(binaryCode) {
    let sixBitGroup = []
    let start = 0
    let end = 6

    let remainder = Math.floor(binaryCode.length % 6)

    if (remainder) {
        // making a flag to put "=" at the end of the encoded string :
        flag = (remainder === 4) ? 1 : 2;
        for (let n = 0; n < flag * 2; n++) {
            // Adding zeros to make the length divisible into six :
            binaryCode.push(0)
        }
    }

    // convert to sixbits groups : 
    for (let x = start; x <= end; x++) {
        let temp = binaryCode.slice(start, end)
        sixBitGroup.push(temp)
        start += 6
        end += 6
        if (end > binaryCode.length)
            break
    }
    return sixBitGroup
}


function readSixBits(sixBitGroup) {
    const numbersInBase64Table = []
    for (let group of sixBitGroup) {
        let base64Number =
            group[0] * 2 ** 5 +
            group[1] * 2 ** 4 +
            group[2] * 2 ** 3 +
            group[3] * 2 ** 2 +
            group[4] * 2 ** 1 +
            group[5] * 2 ** 0

        numbersInBase64Table.push(base64Number)
    }
    let base64String = ''
    numbersInBase64Table.forEach(item => base64String += base64Table[item])
    // adding '=' sign to string if it needs :
    if (flag) (flag === 2) ? base64String += '==' : base64String += '=';
    console.log('from ascii to base64 : ' + base64String)
    return base64String
}



// DECODE FUNCTIONS :



//  CONVERT ASCII CODE CHAR TO BINARY
function numberToSixBitBinary(string) {
    const binaryCode = []
    if (!string) {
        document.getElementById('input1').value = ''
        return
    }
    for (let i = 0; i < string.length; i++) {
        let charCode = base64Table.indexOf(string[i])

        // if we didnt have the character, add error css class
        if (charCode == -1 && string[i] != '=') {
            document.getElementById('input1').classList.add('error')
            document.getElementById('error-box').style.display = 'block'
            console.log('im here')
        }
        else {
            document.getElementById('input1').classList.remove('error')
            document.getElementById('error-box').style.display = 'none'
        }

        // if (charCode === -1) break

        for (let j = 5; j >= 0; j--) {
            let quotient = Math.floor(charCode / 2 ** j)
            charCode = charCode % (2 ** j)
            binaryCode.push(quotient)
        }
    }

    // removing extra zeros at the end of the binary code :
    if (string[string.length - 1] === '=') {
        binaryCode.pop()
        if (string[string.length - 1] === '=')
            binaryCode.pop()
    }

    return binaryCode
}



function binaryToEightbit(binaryCode) {
    let eightBitGroup = []
    let start = 0
    let end = 8
    for (let x = start; x <= end; x++) {
        let temp = binaryCode.slice(start, end)
        eightBitGroup.push(temp)
        start += 8
        end += 8
        if (end > binaryCode.length)
            break
    }
    return eightBitGroup
}



function readEightBits(groupOfEightBits) {
    let numberInAsciiTable = []
    for (let group of groupOfEightBits) {
        let asciiNumber =
            group[0] * 2 ** 7 +
            group[1] * 2 ** 6 +
            group[2] * 2 ** 5 +
            group[3] * 2 ** 4 +
            group[4] * 2 ** 3 +
            group[5] * 2 ** 2 +
            group[6] * 2 ** 1 +
            group[7] * 2 ** 0

        numberInAsciiTable.push(asciiNumber)
    }
    let decodedString = ''
    // read code from ascii table (fromCharCode) :
    numberInAsciiTable.forEach(item => decodedString += String.fromCharCode(item))
    console.log('from base64 to ascii : ' + decodedString)
    return decodedString
}