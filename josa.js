/**
 * https://gist.github.com/sooop/4958873
 * created by https://github.com/sooop
 * 초성 중성 종성 분리 하기

 유니코드 한글은 0xAC00 으로부터
 초성 19개, 중상21개, 종성28개로 이루어지고
 이들을 조합한 11,172개의 문자를 갖는다.
 한글코드의 값 = ((초성 * 21) + 중성) * 28 + 종성 + 0xAC00
 (0xAC00은 'ㄱ'의 코드값)
 따라서 다음과 같은 계산 식이 구해진다.
 유니코드 한글 문자 코드 값이 X일 때,
 초성 = ((X - 0xAC00) / 28) / 21
 중성 = ((X - 0xAC00) / 28) % 21
 종성 = (X - 0xAC00) % 28
 이 때 초성, 중성, 종성의 값은 각 소리 글자의 코드값이 아니라
 이들이 각각 몇 번째 문자인가를 나타내기 때문에 다음과 같이 다시 처리한다.
 초성문자코드 = 초성 + 0x1100 //('ㄱ')
 중성문자코드 = 중성 + 0x1161 // ('ㅏ')
 종성문자코드 = 종성 + 0x11A8 - 1 // (종성이 없는 경우가 있으므로 1을 뺌)
 **/

function iSound(a) {
    var r = ((a.charCodeAt(0) - parseInt('0xac00',16)) /28) / 21;
    var t = String.fromCharCode(r + parseInt('0x1100',16));
    return t;
}

function mSound(a) {
    var r = ((a.charCodeAt(0)- parseInt('0xac00',16)) / 28) % 21;
    var t = String.fromCharCode(r + parseInt('0x1161',16));
    return t;
}

function tSound(a) {
    var r = (a.charCodeAt(0) - parseInt('0xac00',16)) % 28;
    var t = String.fromCharCode(r + parseInt('0x11A8') -1);
    return t;
}

(function(){
  var	_f = [
    function(string) { //을/를 구분
      return _hasJong(string) ? '을' : '를';
    },
    function(string){ //은/는 구분
      return _hasJong(string) ? '은' : '는';
    },
    function(string){ //이/가 구분
      return _hasJong(string) ? '이' : '가';
    },
    function(string){ //와/과 구분
      return _hasJong(string) ? '과' : '와';
    },
    function(string){ //으로/로 구분
      return _hasJong(string) && !_hasRieulJong(string) ? '으로' : '로';
    },
  ],
    _formats = {
      '을/를' : _f[0],
      '을' : _f[0],
      '를' : _f[0],
      '을를' : _f[0],
      '은/는' : _f[1],
      '은' : _f[1],
      '는' : _f[1],
      '은는' : _f[1],
      '이/가' : _f[2],
      '이' : _f[2],
      '가' : _f[2],
      '이가' : _f[2],
      '와/과' : _f[3],
      '와' : _f[3],
      '과' : _f[3],
      '와과' : _f[3],
      '으로/로' : _f[4],
      '으로' : _f[4],
      '로' : _f[4],
      '으로로' : _f[4],
    };

  function _hasJong(string){ //string의 마지막 글자가 받침을 가지는지 확인
    string = string.charCodeAt(string.length - 1);
    return (string - 0xac00) % 28 > 0;
  }

  function _hasRieulJong(string){ //string 마지막 글자의 종성이 ᆯ 인지 확인
    if (!_hasJong(string)) {
        return false;
    }
    string = string.charAt(string.length - 1);
    return tSound(string) === 'ᆯ'; //일반적인 'ㄹ'과 받침에 들어가는 'ᆯ'은 코드값이 다르다.
  }

  var josa = {
    c: function(word, format){
      if (typeof _formats[format] === 'undefined') throw 'Invalid format!';
      return _formats[format](word);
    },
    r: function(word, format) {
      return word + josa.c(word, format);
    }
  };

  if (typeof define == 'function' && define.amd) {
    define(function(){
      return josa;
    });
  } else if (typeof module !== 'undefined') {
    module.exports = josa;
  } else {
    window.Josa = josa;
  }
})();
