window.onload = function() {
  tinymce.init({
    selector: '#tiny-mce-post-body',
    plugins: ["allychecker advcode advlist lists link checklist autolink autosave code", 'preview', 'searchreplace', 'wordcount', 'media table emoticons image imagetools'],
    toolbar: 'bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media | forcolor backcolor emoticons | code preview', 
    height: 300,
    autometic_uploads: true,
    image_upload_url: '/uploads/postimage',
    relative_urls: false,
    images_upload_handler: function (blobInfo, success, failure) {
      let headers = new Headers()
      headers.append('Accept', 'Application/JSON')

      let formData = new FormData()
      formData.append('post-image', blobInfo.blob(), blobInfo.filename())

      let req = new Request('/uploads/postimage', {
        method: 'POST', 
        headers,
        node: 'cors',
        body: formData
      })

      fetch(req)
        .then(req => req.json())
        .then(data => success(data.imgUrl))
        .catch(() => failure('HTTP Error'))
    }
  })
}