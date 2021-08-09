import sanityClient from '@sanity/client'

export default sanityClient({
	projectId: '3zh6l6h3',
	dataset: 'production',
	useCdn: true,
})
