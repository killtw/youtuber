function get_id(url){
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match && match[7].length === 11) {
    return match[7];
  } else {
    alert("Can't catch video id.");
    return 'error';
  }
}

function qs_parse(qs) {
  var hash = {};
  qs = qs.split('&');

  qs.forEach(function(q) {
    var x = q.replace(/\+/g, '%20'),
        idx = x.indexOf('='),
        kstr, vstr, k, v;
    if (idx > 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }
    try {
      k = decodeURIComponent(kstr);
      v = decodeURIComponent(vstr);
    } catch (e) {
      k = unescape(kstr);
      v = unescape(vstr);
    }
    if (!hash.hasOwnProperty(k)) {
      hash[k] = v;
    } else if (Array.isArray(hash[k])) {
      hash[k].push(v);
    } else {
      hash[k] = [hash[k], v];
    }
  });
  return hash;
}

function get_video(id) {
  var INFO_URL = 'http://www.youtube.com/get_video_info?el=detailpage&video_id=';
  $.get(INFO_URL + id, function(data) {
    var info = qs_parse(data);
    var url = info.url_encoded_fmt_stream_map.replace(/%3B\+/g, '&').replace(/%3D/g, '=').split(',').map(function(format) {
      var data = qs_parse(format);
      if (data.sig) {
        data.url += '&signature=' + data.sig;
      }
      return data;
    });
    $('#table').before('<iframe width="560" height="315" src="http://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>');
    $('#table').append('<caption>' + info.title + '</caption>');
    url.forEach(function(link) {
      $('#table').find('tbody').append('<tr><td><a href="' + link.url + '" class="btn btn-small btn-success"><i class="icon-download-alt icon-white"></i> Download</a></td><td>' + link.type + '</td><td>' + link.quality + '</td></tr>');
    });
  });
  $('#table').fadeIn('slow');
}